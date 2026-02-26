// serviceRoutes.ts

import express from 'express'
import {
  createService,
  editService,
  deleteService,
  getAllServices,
  getService,
  getBookingTimesForService,
  getAllServicesForUser,
} from '../controllers/serviceController'
import { authenticate } from '../middleware/auth.middleware' // Import the authenticate middleware
import { checkRole } from '../middleware/role.middleware'

const router = express.Router()

// Create service route (protected route)
router.post(
  '/create',
  authenticate,
  checkRole(['admin', 'provider']),
  createService,
)

// Edit service route (protected route)
router.put(
  '/edit/:serviceId',
  authenticate,
  checkRole(['admin', 'provider']),
  editService,
)

// Delete service route (protected route)
router.delete(
  '/delete/:serviceId',
  authenticate,
  checkRole(['admin', 'provider']),
  deleteService,
)

// Get all services route
router.get('/services', getAllServices)

router.get('/services/:serviceId', getService)

router.get('/services/:serviceId/bookingTimes', getBookingTimesForService)

router.get('/user-services', authenticate, getAllServicesForUser)

export default router
