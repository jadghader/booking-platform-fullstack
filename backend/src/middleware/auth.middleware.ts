// auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../auth/jwt.service'
import jwt from 'jsonwebtoken' // Import the jsonwebtoken library

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'No token available' })
  }

  try {
    // Verify and decode the JWT token using the verifyToken function
    const user = verifyToken(token)
    // Decode the token (without verifying it)
    const decodedToken = jwt.decode(token)
    // Log the decoded token
    console.log('Decoded Token:', decodedToken)
    // Assuming verifyToken returns an object with 'user_id', 'username', and 'role'
    // Make sure your verifyToken function includes the 'role' in the JWT payload

    req.user = user // Assign the user object to the req.user
    next()
  } catch (error) {
    console.error('Token Verification Error:', error)
    return res
      .status(401)
      .json({ message: 'Unauthorized token to be verified' })
  }
}
