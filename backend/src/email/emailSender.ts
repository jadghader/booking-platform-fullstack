import { transporter } from './emailConfig'
import { env } from '../config/env'

export function sendVerificationEmail(
  userEmail: string,
  verificationCode: string,
) {
  const mailOptions = {
    from: env.EMAIL_FROM,
    to: userEmail,
    subject: 'Email Verification',
    html: `
      <p>Use the following code to verify your email:</p>
      <p><strong>${verificationCode}</strong></p>
      <p>Enter this code in the application to complete the verification process.</p>
    `,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error('Error sending email: ' + error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

export function sendPasswordResetEmail(userEmail: string, resetToken: string) {
  const mailOptions = {
    from: env.EMAIL_FROM,
    to: userEmail,
    subject: 'Password Reset',
    html: `
    <p>Use the following code to change your password:</p>
    <p><strong>${resetToken}</strong></p>
    <p>Enter this code in the application to complete the change of password process.</p>
  `,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error('Error sending email: ' + error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

export function sendPasswordChangeEmail(userEmail: string) {
  const mailOptions = {
    from: env.EMAIL_FROM,
    to: userEmail,
    subject: 'Password Reset',
    html: `
      <p>Your Password has been changed successfully</p>
    `,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error('Error sending email: ' + error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
export function sendFormSubmissionEmail(
  name: string,
  email: string,
  category: string,
  message: string,
) {
  const mailOptions = {
    from: `${email}`,
    to: env.CONTACT_RECIPIENT_EMAIL,
    subject: 'Contact Us Form Submission',
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error('Error sending form: ' + error)
    } else {
      console.log('Form sent: ' + info.response)
    }
  })
}
