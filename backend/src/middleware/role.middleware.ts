// auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../auth/jwt.service' // Implement your JWT verification function

const prisma = new PrismaClient()

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({ message: 'No token available' })
    }

    try {
      const user = await verifyToken(token) // Verify the JWT token
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' })
      }

      // Fetch the user's role from the database using Prisma
      const dbUser = await prisma.user.findUnique({
        where: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          emailValidate: user.emailValidate,
        }, // Replace with your actual identifier for the user
        select: {
          role: true,
        },
      })

      if (!dbUser) {
        return res.status(401).json({ message: 'User not found' })
      }

      if (roles.includes(dbUser.role)) {
        req.user = user
        next() // User has one of the allowed roles, proceed to the route
      } else {
        res
          .status(403)
          .json({ message: 'Forbidden: You do not have the required role.' })
      }
    } catch (error) {
      console.error('Token Verification Error:', error)
      res.status(401).json({ message: 'Unauthorized token to be verified' })
    }
  }
}
