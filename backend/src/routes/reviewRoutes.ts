// reviewRoutes.ts

import express from 'express'
import {
  createReview,
  editReview,
  deleteReview,
  getReview,
  getAllReview,
} from '../controllers/reviewController'
import { authenticate } from '../middleware/auth.middleware' // Import the authenticate middleware
import { checkRole } from '../middleware/role.middleware'

const router = express.Router()

// Create review route (protected route)
router.post(
  '/create',
  authenticate,
  checkRole(['admin', 'consumer']),
  createReview,
)

// Edit review route (protected route)
router.put(
  '/edit/:reviewId',
  authenticate,
  checkRole(['admin', 'consumer']),
  editReview,
)

// Delete review route (protected route)
router.delete(
  '/delete/:reviewId',
  authenticate,
  checkRole(['admin', 'consumer']),
  deleteReview,
)

// Get review route (unprotected route, anyone can access)
router.get('/get/:reviewId', checkRole(['admin', 'consumer']), getReview)

router.get('/get', checkRole(['admin']), getAllReview)


export default router
