// bookingRoutes.ts

import express from 'express'
import {
  createBooking,
  editBooking,
  deleteBooking,
  getUserBookings,
  getAllBooking,
} from '../controllers/bookingController'
import { authenticate } from '../middleware/auth.middleware' // Import the authenticate middleware
import { checkRole } from '../middleware/role.middleware'

const router = express.Router()

router.post(
  '/create',
  authenticate,
  checkRole(['admin', 'consumer']),
  createBooking,
)

router.put(
  '/edit/:bookingId',
  authenticate,
  checkRole(['admin', 'consumer']),
  editBooking,
)

router.delete(
  '/delete/:bookingId',
  authenticate,
  checkRole(['admin', 'consumer']),
  deleteBooking,
)

router.get(
  '/get/:bookingId',
  authenticate,
  checkRole(['admin', 'consumer']),
  getUserBookings,
)

router.get('/get', getAllBooking)

export default router
