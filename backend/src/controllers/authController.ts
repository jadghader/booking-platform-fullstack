import { Request, Response } from 'express'
import { PrismaClient, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import {
  sendPasswordChangeEmail,
  sendPasswordResetEmail,
} from '../email/emailSender'
import {
  generateToken,
  verifyToken,
  generateAccessToken,
  verifyRefreshToken,
} from '../auth/jwt.service'
import { generateVerificationCode } from '../auth/code.service'
import validator from 'validator'
import * as yup from 'yup'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

export const loginUser = async (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body

  // Check for missing credentials
  if (!usernameOrEmail || !password) {
    return res
      .status(400)
      .json({ message: 'Please enter both username or email and password' })
  }

  try {
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail.toLowerCase() },
        ],
      },
      select: {
        user_id: true,
        password: true,
        email: true,
        role: true,
        username: true,
        emailValidate: true,
      },
    })

    // If user not found
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or email' })
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user?.password || '')

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    // Generate refresh and access tokens
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

    // Set HTTP-only cookie with the refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.cookie('jwt_access', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // Set the expiration time for the access token
    })

    // Update last login time in the database
    const loginTime = new Date()
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        last_login_at: loginTime,
      },
    })

    // Respond with a success message and access token
    res.json({
      message: 'Login successfully',
      accessToken,
      user: {
        user_id: user.user_id,
        role: user.role,
        username: user.username,
        email: user.email,
        emailValidate: user.emailValidate,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const forgotPasswordCode = async (req: Request, res: Response) => {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({ message: 'Please enter your username' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { username: true, email: true },
    })

    if (!user) {
      return res.status(404).json({ message: 'Username not found' })
    }

    const resetCode = generateVerificationCode(6)

    const userEmail = user?.email || 'default@example.com' 

    await prisma.user.update({
      where: { username: user?.username || '' },
      data: {
        passwordResetCode: resetCode,
      },
    })

    sendPasswordResetEmail(userEmail, resetCode)

    res.json({ message: 'Password reset email sent' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}

export const refreshUser = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
  const refreshToken = cookies.jwt

  try {
    const { user_id, role, username, email, emailValidate } =
      verifyRefreshToken(refreshToken)
    const accessToken = generateAccessToken({
      user_id,
      role,
      userName: username,
      email,
      emailValidate,
    })

    // Update jwt_access cookie with the new access token
    res.cookie('jwt_access', accessToken, {
      httpOnly: true,
      secure: true,
    })

    res.status(200).json({ accessToken })
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Invalid Refresh Token' })
  }
}

export const logout = (req: Request, res: Response) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
  res.json({ message: 'Cookie cleared' })
}

export const emailVerification = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body

  if (!email || !verificationCode) {
    return res
      .status(400)
      .json({ message: 'Email and verification code are required' })
  }

  try {
    // Find the user associated with the email and verification code
    const user = await prisma.user.findFirst({
      where: {
        email,
        emailVerificationCode: verificationCode,
      },
    })

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid email or verification code' })
    }

    if (user.emailValidate) {
      return res.status(400).json({ message: 'Email is already verified' })
    }

    // Update the user's emailValidate property to true
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        emailValidate: true,
        emailVerificationCode: null, // Optional: Clear the verification token
      },
    })

    res.status(200).json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error('Error verifying email: ' + error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const passwordChange = async (req: Request, res: Response) => {
  const userSchema = yup.object().shape({
    password: yup.string().required('Password is required'),
  })

  const { password, verificationCode } = req.body // Retrieve the new password and verification code
  if (!verificationCode) {
    return res.status(400).json({ message: 'Verification code is required' })
  }

  try {
    await userSchema.validate({
      password,
    })
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }

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

  try {
    // Verify the reset token and retrieve the associated user from the database
    const user = await prisma.user.findFirst({
      where: { passwordResetCode: verificationCode },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    // Hash the new password before storing it in the database
    const hashedPassword = await hash(password, 10)

    // Update the user's password and clear the reset token
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        password: hashedPassword,
        passwordResetCode: null, // Clear the reset token after the password is updated
      },
    })
    if (user.email) {
      sendPasswordChangeEmail(user.email)
    } else {
      res.json({ message: 'The email was not send due to email error' })
    }

    // Send a success response
    res.json({ message: 'Password changed  successfully' })
  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const phoneVerification = async (req: Request, res: Response) => {
  const verificationCode = req.body.verificationCode

  if (!verificationCode) {
    return res.status(400).json({ message: 'Verification code is incorrect' })
  }

  try {
    // Find the user associated with the verification code
    const user = await prisma.user.findFirst({
      where: { phoneVerificationCode: verificationCode },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    if (user.phone_number) {
      return res
        .status(400)
        .json({ message: 'Phone number is already verified' })
    }

    // Update the user's emailValidate property to true
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        phoneValidate: true,
        phoneVerificationCode: null, // Optional: Clear the verification token
      },
    })

    res.status(200).json({ message: 'Phone number verified successfully' })
  } catch (error) {
    console.error('Error verifying Phone number : ' + error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const checkAuthStatus = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies?.jwt_access) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const accessToken = cookies.jwt_access

  try {
    res.status(200).json({ accessToken })
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Invalid Token' })
  }
}
