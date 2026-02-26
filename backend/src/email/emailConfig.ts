import nodemailer from 'nodemailer'
import { env } from '../config/env'

export const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_SECURE,
  auth: {
    user: env.EMAIL_NAME,
    pass: env.EMAIL_PASSWORD,
  },
})

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Server is ready to take our messages')
  }
})
