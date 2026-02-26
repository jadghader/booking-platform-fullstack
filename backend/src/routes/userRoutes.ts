// userRoutes.ts

import express from 'express'
import {
  registerUser,
  getUserDetails,
  editUser,
  deleteUser,
  getAllUsers,
  changeUserRole,
  forceDeleteUser,
} from '../controllers/userController'
import { authenticate } from '../middleware/auth.middleware'
import { checkRole } from '../middleware/role.middleware'
import { uploadProfilePicture } from '../controllers/profilePictureController'
import { sendFormByEmail } from '../controllers/userController'
const router = express.Router()

// User registration route
router.post('/register', registerUser)

// Get user details route (protected route)
router.get('/profile/:userId', authenticate, getUserDetails)

// Get all users route (protected route for admin)
router.get('/profile', checkRole(['admin']), authenticate, getAllUsers)

// Edit user route (protected route)
router.put('/edit/:userId', authenticate, editUser)

// Delete user route (protected route)
router.delete('/delete/:userId', authenticate, deleteUser)

router.delete(
  '/delete/force/:userId',
  checkRole(['admin']),
  authenticate,
  forceDeleteUser,
)

// Change user role route (protected route for admin)
router.put(
  '/change-role/:userId',
  checkRole(['admin']),
  authenticate,
  changeUserRole,
)

router.post('/profile-picture', uploadProfilePicture)

router.post('/submit-form', sendFormByEmail)

export default router
