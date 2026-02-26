// Import required modules and schemas in your controller files.

// bookingController.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import * as yup from 'yup'
import { transporter } from '../email/emailConfig'
import { env } from '../config/env'

const prisma = new PrismaClient()

const isValidTimeFormat = (time: string): boolean => {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/

  return regex.test(time)
}

const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/
  return regex.test(date)
}

// Create booking controller
// Helper function to check if a given date is within a specified range
function isDateWithinRange(
  date: string,
  startDate: string,
  endDate: string,
): boolean {
  return date >= startDate && date <= endDate
}

// Helper function to check if a given time is within a specified range
function isTimeWithinRange(
  time: string,
  startTime: string,
  endTime: string,
): boolean {
  // Convert time to a comparable format, e.g., minutes since midnight
  // ...

  // Compare the time within the valid range
  return time >= startTime && time <= endTime
}

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { bookingTime_id, bookedDate, bookedTime } = req.body
    const user: any = req.user

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({
        message:
          'Unauthorized: You need to be authenticated to create a booking',
      })
    }

    // Check if the user is an admin or a consumer
    if (user.role !== 'consumer') {
      return res.status(403).json({
        message: 'Forbidden: Only consumers can create bookings',
      })
    }

    // Check if the selected booking time is available for the service
    const bookingTime = await prisma.bookingTime.findUnique({
      where: {
        bookingTime_id: bookingTime_id,
      },
      include: {
        service: true,
        bookings: true,
      },
    })

    if (!bookingTime || !bookingTime.service) {
      return res.status(400).json({
        message:
          'Invalid booking time or service does not have available booking times.',
      })
    }

    // Check if the specified date and time are in valid formats and within the valid range
    if (
      !isValidDateFormat(bookedDate) ||
      !isDateWithinRange(
        bookedDate,
        bookingTime.start_date,
        bookingTime.end_date,
      )
    ) {
      return res.status(400).json({
        message: 'Invalid or out-of-range date.',
      })
    }

    if (
      !isValidTimeFormat(bookedTime) ||
      !isTimeWithinRange(
        bookedTime,
        bookingTime.start_time,
        bookingTime.end_time,
      )
    ) {
      return res.status(400).json({
        message: 'Invalid or out-of-range time.',
      })
    }

    // Check if someone else has already booked the same date and time slot
    const existingBooking = bookingTime.bookings.find(
      (booking) =>
        booking.bookedDate === bookedDate && booking.bookedTime === bookedTime,
    )

    if (existingBooking) {
      return res.status(400).json({
        message: 'Someone else has already booked the same date and time slot.',
      })
    }

    // Create the booking using Prisma
    const createdBooking = await prisma.booking.create({
      data: {
        bookedDate: bookedDate,
        bookedTime: bookedTime,
        consumer: {
          connect: { user_id: user.user_id },
        },
        provider: {
          connect: { user_id: bookingTime.service.user_id },
        },
        bookingTime: {
          connect: { bookingTime_id },
        },
        Service: {
          connect: { service_id: bookingTime.service.service_id },
        },
      },
      include: {
        consumer: true,
        provider: true,
        Service: true,
      },
    })

    if (user.email) {
      await transporter.sendMail({
        from: env.EMAIL_FROM,
        to: user.email, // Use the email of the consumer
        subject: 'Booking Confirmation',
        text: `Dear ${user.username},\n\nThank you for booking with us!\n\nBooking Details:\nService: ${createdBooking.Service?.title}\nDescription: ${createdBooking.Service?.description}\nDate and Time: ${createdBooking.bookedDate} ${createdBooking.bookedTime}\nPhone Number: ${createdBooking.provider?.phone_number}\n\nWe look forward to serving you!\n\nBest regards,\nThe BookMyService Team`,
      })
    }

    // Send email to the provider
    const providerEmail = createdBooking.provider?.email || ''
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: providerEmail, // Use the email of the service provider
      subject: 'New Booking',
      text: `Dear ${
        createdBooking.provider?.username || 'Service Provider'
      },\n\nYou have a new booking!\n\nBooking Details:\nConsumer: ${
        user.username
      }\nService: ${createdBooking.Service?.title}\nDescription: ${
        createdBooking.Service?.description
      }\nDate and Time: ${createdBooking.bookedDate} ${
        createdBooking.bookedTime
      }\nPhone Number: ${
        createdBooking.consumer?.phone_number
      }\n\nPlease be prepared for the appointment.\n\nBest regards,\nThe BookMyService Team`,
    })

    res.json({
      message: 'Booking created successfully',
      booking: createdBooking,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
// Edit booking controller
export const editBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.bookingId, 10)
    const { bookingTime_id } = req.body
    const user: any = req.user

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: You need to be authenticated to edit a booking',
      })
    }

    // Check if the selected booking time is available for the service
    const bookingTime = await prisma.bookingTime.findUnique({
      where: {
        bookingTime_id,
      },
      include: {
        service: true,
      },
    })

    if (!bookingTime || !bookingTime.service) {
      return res.status(400).json({
        message:
          'Invalid booking time or service does not have available booking times.',
      })
    }

    // Check if the selected time is already booked for the service
    const existingBooking = await prisma.booking.findFirst({
      where: {
        bookingTime_id,
      },
    })

    if (existingBooking) {
      return res.status(400).json({
        message: 'This service is already booked at the selected time.',
      })
    }

    // Update the booking using Prisma
    const updatedBooking = await prisma.booking.update({
      where: {
        booking_id: bookingId,
      },
      data: {
        bookingTime: {
          connect: { bookingTime_id },
        },
      },
    })

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

// Delete booking controller
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.bookingId, 10)
    const user: any = req.user

    // Check if the user is not authenticated
    if (!user) {
      return res.status(401).json({
        message:
          'Unauthorized: You need to be authenticated to delete a booking',
      })
    }

    // Delete booking from the Booking table using Prisma
    await prisma.booking.delete({
      where: {
        booking_id: bookingId,
      },
    })

    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: "Booking to delete doesn't exist or an error occurred" })
  }
}

// Get booking controller
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const user: any = req.user // Retrieve user information from the authenticated user

    // Check if the user is not authenticated
    if (!user) {
      return res.status(401).json({
        message:
          'Unauthorized: You need to be authenticated to view your bookings',
      })
    }

    const userId = user.user_id

    // Retrieve all bookings for the specified user from the Booking table using Prisma
    const bookings = await prisma.booking.findMany({
      where: {
        consumer_id: userId,
      },
    })

    res.json(bookings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const getAllBooking = async (req: Request, res: Response) => {
  try {
    // Retrieve all bookings from the Booking table using Prisma
    const bookings = await prisma.booking.findMany()

    res.json(bookings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
