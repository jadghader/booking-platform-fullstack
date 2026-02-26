// authRouter.ts

import express from 'express'
import {
  checkAuthStatus,
  forgotPasswordCode,
  loginUser,
  logout,
  passwordChange,
  refreshUser,
} from '../controllers/authController'
import { loginLimiter } from '../middleware/login.limiter'
import {
  emailVerification,
  phoneVerification,
} from '../controllers/authController'

const router = express.Router()

router.post('/login', loginLimiter, loginUser)

router.get('/refresh', refreshUser)

router.post('/forgot-password', forgotPasswordCode)

router.get('/user-verify', checkAuthStatus)

router.post('/logout', logout)

router.post('/email-verify', emailVerification)

router.post('/change-password', passwordChange)

router.post('/verifyPhoneNumber', phoneVerification)

export default router
