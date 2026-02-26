// serviceController.ts

import { Request, Response } from 'express'
import * as yup from 'yup'
import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

const serviceSchema = yup.object().shape({
  category: yup.string().required('Category is required'),
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required'),
  bookingTimes: yup
    .array()
    .of(yup.object())
    .required('Booking times are required'),
})

const allowedCategories = [
  'Home Services',
  'Personal Services',
  'Event Services',
  'Health and Wellness',
  'Automotive Services',
  'Educational Services',
  'Technology Services',
  'Business Services',
  'Delivery and Logistics',
  'Repair and Maintenance',
]

// Create the associated booking times
const isValidTimeFormat = (time: string): boolean => {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/

  return regex.test(time)
}

const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/
  return regex.test(date)
}

export const createService = async (req: Request, res: Response) => {
  try {
    const { category, title, description, price, bookingTimes, provider_id } =
      req.body

    // Check if the received category is valid
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }

    const user: any = req.user

    if (!user) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions to create a service',
      })
    }
    // Validate booking times
    const isValidBookingTimes = bookingTimes.every(
      (bookingTime: any) =>
        isValidTimeFormat(bookingTime.start_time) &&
        isValidTimeFormat(bookingTime.end_time) &&
        isValidDateFormat(bookingTime.start_date) &&
        isValidDateFormat(bookingTime.end_date),
    )

    if (!isValidBookingTimes) {
      return res.status(400).json({ message: 'Invalid booking times' })
    }

    // Determine user_id based on role
    const user_id = user.role === 'admin' ? provider_id : user.user_id

    // Create the service
    // Create the service
    const createdService = await prisma.service.create({
      data: {
        user: {
          connect: {
            user_id,
          },
        },
        category,
        title,
        description,
        price: parseFloat(price),
      },
    })

    // Create the associated booking times
    const createdBookingTimes = await Promise.all(
      bookingTimes.map(async (bookingTime: any) => {
        // Validate time and date formats
        if (
          !isValidTimeFormat(bookingTime.start_time) ||
          !isValidTimeFormat(bookingTime.end_time) ||
          !isValidDateFormat(bookingTime.start_date) ||
          !isValidDateFormat(bookingTime.end_date)
        ) {
          throw new Error('Invalid time or date format')
        }

        const createdBookingTime = await prisma.bookingTime.create({
          data: {
            start_time: bookingTime.start_time,
            end_time: bookingTime.end_time,
            start_date: bookingTime.start_date,
            end_date: bookingTime.end_date,
            service: {
              connect: {
                service_id: createdService.service_id,
              },
            },
            User: {
              connect: {
                user_id: user.user_id,
              },
            },
          },
        })

        return createdBookingTime
      }),
    )

    // Update the service with associated booking times
    const updatedService = await prisma.service.update({
      where: {
        service_id: createdService.service_id,
      },
      data: {
        bookingTimes: {
          connect: createdBookingTimes.map((bookingTime) => ({
            bookingTime_id: bookingTime.bookingTime_id,
          })),
        },
      },
    })

    res.json({
      message: 'Service created successfully',
      service: updatedService,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  } finally {
    await prisma.$disconnect() // Disconnect from the database
  }
}

export const editService = async (req: Request, res: Response) => {
  try {
    // Retrieve user information from the authenticated user
    const user: any = req.user

    // Destructure request body
    const { category, title, description, price, bookingTimes } = req.body

    // Check if the received category is valid
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }
    // Parse the service ID as an integer
    const serviceId = parseInt(req.params.serviceId, 10)

    // Check if parsing the service ID was successful
    if (isNaN(serviceId)) {
      return res.status(400).json({ message: 'Invalid service ID' })
    }

    // Check if the service exists
    const existingService = await prisma.service.findFirst({
      where: {
        service_id: serviceId,
      },
      include: {
        bookingTimes: true,
      },
    })

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' })
    }

    // Check if the user has the necessary permissions
    if (
      !user ||
      !(
        user.role === 'admin' ||
        (user.role === 'provider' && user.user_id === existingService.user_id)
      )
    ) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to edit this service',
      })
    }

    const updateBookingTimes = async (
      existingBookingTimes: any[],
      updatedBookingTimes: any[],
    ) => {
      const updatedTimes = await Promise.all(
        updatedBookingTimes.map(async (bookingTime: any, index) => {
          if (existingBookingTimes[index]) {
            // Update existing BookingTime
            return prisma.bookingTime.update({
              where: {
                bookingTime_id: existingBookingTimes[index].bookingTime_id,
              },
              data: {
                start_time: bookingTime.start_time,
                end_time: bookingTime.end_time,
                start_date: bookingTime.start_date,
                end_date: bookingTime.end_date,
              },
            })
          } else {
            // Create new BookingTime
            return prisma.bookingTime.create({
              data: {
                start_time: bookingTime.start_time,
                end_time: bookingTime.end_time,
                start_date: bookingTime.start_date,
                end_date: bookingTime.end_date,
                service: {
                  connect: {
                    service_id: serviceId,
                  },
                },
                User: {
                  connect: {
                    user_id: user.user_id,
                  },
                },
              },
            })
          }
        }),
      )

      return updatedTimes
    }
    const updateService = async (serviceId: number, data: any) => {
      return prisma.service.update({
        where: {
          service_id: serviceId,
        },
        data,
      })
    }

    // Separate updates for Service and BookingTimes
    const updatedService = await updateService(serviceId, {
      category,
      title,
      description,
      price: parseFloat(price),
    })

    const updatedBookingTimes = await updateBookingTimes(
      existingService.bookingTimes,
      bookingTimes,
    )

    // Combine updates in the final update for Service
    const finalUpdatedService = await prisma.service.update({
      where: {
        service_id: serviceId,
      },
      data: {
        bookingTimes: {
          connect: updatedBookingTimes.map((bookingTime) => ({
            bookingTime_id: bookingTime.bookingTime_id,
          })),
        },
      },
      include: {
        bookingTimes: true,
      },
    })

    res.json({
      message: 'Service updated successfully',
      service: finalUpdatedService,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const deleteService = async (req: Request, res: Response) => {
  try {
    // Retrieve user information from the authenticated user
    const user: any = req.user

    // Get the service ID from the URL parameter
    const serviceId = parseInt(req.params.serviceId, 10)

    // Check if the service exists
    const existingService = await prisma.service.findFirst({
      where: {
        service_id: serviceId,
      },
    })

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' })
    }
    if (
      !user ||
      !(
        user.role === 'admin' ||
        (user.role === 'provider' && user.user_id === existingService.user_id)
      )
    ) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions to delete a service',
      })
    }

    // Delete related records first (example: if there's a 'comments' table)
    await prisma.bookingTime.deleteMany({
      where: {
        service_id: serviceId,
      },
    })
    // Delete service using Prisma
    await prisma.service.delete({
      where: {
        service_id: serviceId,
      },
    })

    res.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const getAllServices = async (req: Request, res: Response) => {
  try {
    // Extract filter parameters from query string
    const { category, title, minPrice, maxPrice, bookingTimes } = req.query

    // Construct the filter object based on provided parameters
    const filter: any = {}
    if (category) filter.category = category as string
    if (title) filter.title = { contains: title as string }
    if (minPrice) filter.price = { gte: parseFloat(minPrice as string) }
    if (maxPrice)
      filter.price = { ...filter.price, lte: parseFloat(maxPrice as string) }
    if (bookingTimes) {
      const timesArray = Array.isArray(bookingTimes)
        ? bookingTimes
        : [bookingTimes]
      filter.bookingTimes = { in: timesArray }
    }

    // Check if there are no filter parameters, and if so, retrieve all services
    const retrieveAllServices = Object.keys(filter).length === 0

    // Retrieve services from the Service table using Prisma, including user information
    const services = await prisma.service.findMany({
      where: retrieveAllServices ? {} : filter,
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            role: true,
          },
        },
        bookingTimes: true, // Include the bookingTimes property
      },
    })
    // Return the services as a JSON response
    res.json(services)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const getService = async (req: Request, res: Response) => {
  try {
    // Retrieve user information from the authenticated user

    // Get the service ID from the URL parameter
    const serviceId = parseInt(req.params.serviceId, 10)

    // Retrieve the specified service from the Service table using Prisma, including user information
    const service = await prisma.service.findUnique({
      where: {
        service_id: serviceId,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            role: true,
          },
        },
        bookingTimes: true, // Include the bookingTimes property
      },
    })

    // Check if the service exists
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    // Return the service as a JSON response
    res.json(service)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
export const getBookingTimesForService = async (
  req: Request,
  res: Response,
) => {
  try {
    // Get the service ID from the URL parameter
    const serviceId = parseInt(req.params.serviceId, 10)

    // Retrieve the booking times for the specified service
    const bookingTimes = await prisma.bookingTime.findMany({
      where: {
        service_id: serviceId,
      },
    })

    // Return the booking times as a JSON response
    res.json(bookingTimes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const getAllServicesForUser = async (req: Request, res: Response) => {
  try {
    // Retrieve user information from the authenticated user
    const user: any = req.user
    console.log(user)
    // Check if the user is authenticated
    if (!user) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions to get services',
      })
    }

    // Retrieve services from the Service table using Prisma, including user information
    const services = await prisma.service.findMany({
      where: {
        user_id: user.user_id,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            role: true,
          },
        },
        bookingTimes: true,
      },
    })

    // Return the services as a JSON response
    res.json(services)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  } finally {
    await prisma.$disconnect() // Disconnect from the database
  }
}
