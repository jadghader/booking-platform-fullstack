// userController.ts

import { Request, Response } from 'express'
import db from '../db' // Import the database connection
import * as yup from 'yup'
import { hash } from 'bcrypt' // Import bcrypt for password hashing
import { generateAccessToken, generateToken } from '../auth/jwt.service'
import {
  sendFormSubmissionEmail,
  sendVerificationEmail,
} from '../email/emailSender'
import { PrismaClient, User } from '@prisma/client'
import validator from 'validator'
import { generateVerificationCode } from '../auth/code.service'

const prisma = new PrismaClient()

// User registration controller
export const registerUser = async (req: Request, res: Response) => {
  const userSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    role: yup
      .string()
      .oneOf(['admin', 'provider', 'consumer'])
      .required('Role is required'),
    phone_number: yup.string().required('Phone number is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    location: yup.string().required('Location is required'),
  })

  try {
    const { username, password, role, phone_number, email, location } = req.body

    // Validate the request body for these specific fields
    try {
      await userSchema.validate({
        username,
        password,
        role,
        email,
        location,
        phone_number,
      })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }

    if (!validator.matches(username, /^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json({ message: 'Username should only contain letters and numbers' })
    }

    // Check if the password is strong enough (at least 8 characters, including letters and numbers)
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
    ) {
      return res.status(400).json({ message: 'Password is not strong enough' })
    }

    // Check if the email is in a valid format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // Check if the phone number is in a valid format (you can customize this based on your needs)
    if (!validator.isMobilePhone(phone_number, 'any', { strictMode: false })) {
      return res.status(400).json({ message: 'Invalid phone number format' })
    }
    // Check if a user with the same username, email, or phone number already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email },
          { phone_number: phone_number },
        ],
      },
    })

    if (existingUser) {
      const errorMessages = []

      if (existingUser.username === username) {
        errorMessages.push('Username already exists')
      }

      if (existingUser.email === email) {
        errorMessages.push('Email already exists')
      }

      if (existingUser.phone_number === phone_number) {
        errorMessages.push('Phone number already exists')
      }

      return res.status(400).json({
        message: errorMessages.join(', '),
      })
    }

    try {
      // Hash the user's password before storing it in the database
      const hashedPassword = await hash(password, 10)

      const emailVerificationCode = generateVerificationCode(6)

      const verificationCode = generateVerificationCode(6) // Change 6 to the desired length of the verification code

      // Create a new user using Prisma
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role,
          phone_number,
          email,
          location,
          emailValidate: false,
          phoneValidate: false,
          emailVerificationCode,
          phoneVerificationCode: verificationCode,
        },
      })

      const refreshToken = generateToken({
        user_id: user.user_id,
        role: user.role,
        userName: user.username,
        email: user.email,
        emailValidate: user.emailValidate, // Include the 'role' in the token payload
      })

      const accessToken = generateAccessToken({
        user_id: user.user_id,
        role: user.role,
        userName: user.username,
        email: user.email,
        emailValidate: user.emailValidate, // Include the 'role' in the token payload
      })

      res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'none', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      })

      res.cookie('jwt_access', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000, // Set the expiration time for the access token
      })

      res.json({
        message: 'User registered successfully',
        accessToken,
        user: {
          user_id: user.user_id,
          role: user.role,
          username: user.username,
          email: user.email,
          emailValidate: user.emailValidate,
        },
      })

      sendVerificationEmail(email, emailVerificationCode)
    } catch (hashingError) {
      console.error(hashingError)
      return res
        .status(500)
        .json({ message: 'An error occurred while hashing the password' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

// Get all users controller
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user: any = req.user

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: You need to be authenticated to get all users',
      })
    }

    const isAdmin = (user as User)?.role === 'admin'

    if (!isAdmin) {
      return res.status(403).json({
        message: 'Forbidden: You are not authorized to get all users',
      })
    }

    // Retrieve all user details from the User table using Prisma
    const users = await prisma.user.findMany()

    res.json(users) // Send the user details
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

// Get user details controller
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userIdToGet = parseInt(req.params.userId, 10)
    const user: any = req.user

    if (!user) {
      return res.status(401).json({
        message:
          'Unauthorized: You need to be authenticated to get user details',
      })
    }

    const isAdmin = (user as User)?.role === 'admin'
    const userId = user?.user_id

    console.log('userIdToGet:', userIdToGet)
    console.log('isAdmin:', isAdmin)

    // Check if the user is authorized to get details
    if (userIdToGet === userId || isAdmin) {
      // Retrieve user details from the database using Prisma
      const userToGet = await prisma.user.findUnique({
        where: {
          user_id: userIdToGet,
        },
      })

      // Check if the user exists
      if (!userToGet) {
        console.log('User to get not found')
        return res.status(404).json({ message: 'User not found' })
      }

      // Send the user details as a JSON response
      return res.json(userToGet)
    } else {
      // Unauthorized access
      console.log('Authorization check failed')
      return res.status(403).json({
        message:
          'Forbidden: You are not authorized to get details for this user',
      })
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

// Edit user controller
export const editUser = async (req: Request, res: Response) => {
  const userSchema = yup.object().shape({
    username: yup.string(),
    password: yup.string(),
    role: yup.string().oneOf(['admin', 'provider', 'consumer']),
    phone_number: yup.string(),
    email: yup.string().email('Invalid email format'),
    location: yup.string(),
  })

  try {
    const userId = parseInt(req.params.userId, 10)
    const {
      username,
      password,
      email,
      bio,
      location,
      phone_number,
      profile_picture,
    } = req.body

    // Validate the request body for these specific fields
    try {
      await userSchema.validate({
        username,
        password,
        email,
        bio,
        location,
        phone_number,
        profile_picture,
      })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }

    // Ensure that the user making the request matches the user being updated
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        username: true,
        email: true,
        phone_number: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (!req.user) {
      return res.status(403).json({
        message: 'Forbidden: You are not authorized to edit this user.',
      })
    }

    const errorMessages = []

    if (username) {
      // Check if the username already exists for another user
      const existingUsernameUser = await prisma.user.findFirst({
        where: {
          username: username,
          NOT: {
            user_id: userId,
          },
        },
      })
      if (existingUsernameUser) {
        errorMessages.push('Username already exists')
      }
    }

    if (email && email !== user.email) {
      // Check if the email already exists for another user
      const existingEmailUser = await prisma.user.findFirst({
        where: {
          email: email,
          NOT: {
            user_id: userId,
          },
        },
      })
      if (existingEmailUser) {
        errorMessages.push('Email already exists')
      } else {
        // If the email is changed, set emailValidate to false
        await prisma.user.update({
          where: {
            user_id: userId,
          },
          data: {
            emailValidate: false,
          },
        })
      }
    }

    if (phone_number) {
      // Check if the phone number already exists for another user
      const existingPhoneNumberUser = await prisma.user.findFirst({
        where: {
          phone_number: phone_number,
          NOT: {
            user_id: userId,
          },
        },
      })
      if (existingPhoneNumberUser) {
        errorMessages.push('Phone number already exists')
      }
    }

    if (errorMessages.length > 0) {
      return res.status(400).json({ message: errorMessages.join(', ') })
    }
    // Validate the request body for these specific fields
    if (username) {
      if (!validator.matches(username, /^[a-zA-Z0-9]+$/)) {
        return res
          .status(400)
          .json({ message: 'Username should only contain letters and numbers' })
      }
    }

    if (password) {
      // Check if the password is strong enough (at least 8 characters, including letters and numbers)
      if (
        !validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
        })
      ) {
        return res
          .status(400)
          .json({ message: 'Password is not strong enough' })
      }
    }

    const hashedPassword = password ? await hash(password, 10) : undefined

    // Update user details in the User table using Prisma
    const updatedUser = await prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        username,
        password: hashedPassword,
        phone_number,
        email,
        location,
        bio,
        profile_picture,
      },
    })

    const token = generateToken({ username })

    // Send verification email for the new email
    sendVerificationEmail(email, token)

    res.json({ message: 'User updated successfully', user: updatedUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'An error occurred while changing data you cannot change',
    })
  }
}

// Delete user controller
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userIdToDelete = parseInt(req.params.userId, 10) // Get the user ID to delete from the URL parameter
    const user: any = req.user // Retrieve user information from the authenticated user

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: You need to be authenticated to delete a user',
      })
    }
    const isAdmin = (user as User)?.role === 'admin'
    const userId = user?.userId

    if (userIdToDelete === userId || isAdmin) {
      // The user is authorized to delete the user
      // Check if the user with the given ID exists
      const userToDelete = await prisma.user.findUnique({
        where: {
          user_id: userIdToDelete,
        },
      })

      if (!userToDelete) {
        console.log('User to delete not found')
        return res.status(404).json({ message: 'User not found' })
      }

      // Delete the user using Prisma
      await prisma.user.delete({
        where: {
          user_id: userIdToDelete,
        },
      })

      console.log('User deleted successfully')
      res.json({ message: 'User deleted successfully' })
    } else {
      console.log('Authorization check failed')
      return res.status(403).json({
        message: 'Forbidden: You are not authorized to delete this user',
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const forceDeleteUser = async (req: Request, res: Response) => {
  try {
    const userIdToDelete = parseInt(req.params.userId, 10) // Get the user ID to delete from the URL parameter
    const user: any = req.user // Retrieve user information from the authenticated user

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: You need to be authenticated to delete a user',
      })
    }

    const isAdmin = (user as User)?.role === 'admin'
    const userId = user?.userId

    if (userIdToDelete === userId || isAdmin) {
      // The user is authorized to delete the user
      // Check if the user with the given ID exists
      const userToDelete = await prisma.user.findUnique({
        where: {
          user_id: userIdToDelete,
        },
      })

      if (!userToDelete) {
        console.log('User to delete not found')
        return res.status(404).json({ message: 'User not found' })
      }

      // Use Prisma transaction to delete user and related services
      await prisma.$transaction([
        prisma.service.deleteMany({
          where: {
            user_id: userIdToDelete,
          },
        }),
        prisma.user.delete({
          where: {
            user_id: userIdToDelete,
          },
        }),
      ])

      console.log('User and related services deleted successfully')
      res.json({ message: 'User and related services deleted successfully' })
    } else {
      console.log('Authorization check failed')
      return res.status(403).json({
        message: 'Forbidden: You are not authorized to delete this user',
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  } finally {
    await prisma.$disconnect() // Close the Prisma client
  }
}

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params // Get the user ID from the URL parameter
    const { role } = req.body // Get the new role from the request body

    const user: any = req.user // Retrieve user information from the authenticated user
    const isAdmin = (user as User)?.role === 'admin'

    // Ensure that only admins can change user roles
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not have the required role.' })
    }

    // Update the user's role in the database
    await prisma.user.update({
      where: { user_id: parseInt(userId, 10) }, // Replace with your actual identifier for the user
      data: { role },
    })

    res.json({ message: 'User role updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const sendFormByEmail = async (req: Request, res: Response) => {
  try {
    // Extract form data from the request body
    const { name, email, category, message } = req.body

    // Validate form data
    if (!name || !email || !category || !message) {
      return res.status(400).json({ message: 'All form fields are required' })
    }
    sendFormSubmissionEmail(name, email, category, message)
    // Respond with success message
    res.status(200).json({ message: 'Form submitted successfully' })
  } catch (error) {
    console.error('Error sending form by email:', error)
    res
      .status(500)
      .json({ message: 'An error occurred while processing the form' })
  }
}
