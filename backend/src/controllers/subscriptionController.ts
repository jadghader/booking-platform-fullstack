// subscriptionController.ts

import { Request, Response } from 'express'
import db from '../db' // Import the database connection
import * as yup from 'yup'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()
const subscriptionSchema = yup.object().shape({
  provider_id: yup.number().required('Provider ID is required'),
  expiry_date: yup.date().required('Expiry date is required'),
})

// Create subscription controller
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { expiry_date, currency } = req.body
    const user: any = req.user // Retrieve user information from the authenticated user

    // Check if the authenticated user is not null and the user_id in the request body matches the authenticated user's user_id
    if (
      !user ||
      user.role !== 'admin' ||
      user.user_id !== req.body.provider_id
    ) {
      return res.status(403).json({
        message: 'Forbidden: You are not authorized to perform this action',
      })
    }

    // Validate the request body against the subscriptionSchema
    try {
      await subscriptionSchema.validate({
        provider_id: user.user_id, // Set the provider_id to the authenticated user's user_id
        expiry_date,
        currency,
      })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }

    // Create the subscription using Prisma
    const createdSubscription = await prisma.subscription.create({
      data: {
        provider: {
          connect: {
            user_id: user.user_id,
          },
        },
        expiry_date,
        currency,
      },
    })

    res.json({
      message: 'Subscription created successfully',
      subscription: {
        provider_id: user.user_id,
        expiry_date,
        user: { user_id: user.user_id, username: user.username }, // Include relevant user information
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

// Get subscriptions for a provider controller
export const getProviderSubscriptions = async (req: Request, res: Response) => {
  try {
    const providerId = parseInt(req.params.providerId, 10) // Get the provider ID from the URL parameter
    const user: any = req.user

    // Check if the user is an admin or the user associated with the subscription
    const isAdmin = user?.role === 'admin'
    const isUserRelatedToSubscription = user?.user_id === providerId

    if (!(isAdmin || isUserRelatedToSubscription)) {
      return res.status(403).json({
        message:
          'Forbidden: You are not authorized to view these subscriptions',
      })
    }

    // Retrieve subscriptions for the specified provider from the Subscription table
    const subscriptions = await prisma.subscription.findMany({
      where: {
        provider_id: providerId,
      },
    })

    res.json(subscriptions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

// Edit subscription controller
export const editSubscription = async (req: Request, res: Response) => {
  try {
    const subscriptionId = parseInt(req.params.subscriptionId, 10) // Get the subscription ID from the URL parameter
    const { expiry_date } = req.body
    const user: any = req.user

    // Check if the user is not authenticated
    if (!user) {
      return res.status(401).json({
        message:
          'Unauthorized: You need to be authenticated to edit a subscription',
      })
    }

    const isAdmin = user.role === 'admin'
    const userId = user.user_id

    // Check if the user is the admin or the user related to the subscription
    const isAuthorized = isAdmin || user.provider_id === userId // Should be userId, not provider_id

    if (!isAuthorized) {
      return res.status(403).json({
        message: 'Forbidden: You are not authorized to edit this subscription',
      })
    }

    // Validate the request body against the subscriptionSchema
    try {
      await subscriptionSchema.validate({
        expiry_date,
      })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }

    // Update subscription details using Prisma
    const updatedSubscription = await prisma.subscription.update({
      where: {
        subscription_id: subscriptionId,
      },
      data: {
        expiry_date,
      },
    })

    res.json({
      message: 'Subscription updated successfully',
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

// Delete subscription controller
export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const subscriptionId = parseInt(req.params.subscriptionId, 10)
    const user: any = req.user

    // Check if the user is not authenticated
    if (!user) {
      return res.status(401).json({
        message:
          'Unauthorized: You need to be authenticated to delete a subscription',
      })
    }

    const isAdmin = user.role === 'admin'
    const userId = user.user_id

    // Check if the user is the admin or the user related to the subscription
    const isAuthorized = isAdmin || userId === user.provider_id

    if (!isAuthorized) {
      return res.status(403).json({
        message:
          'Forbidden: You are not authorized to delete this subscription',
      })
    }

    // Delete subscription from the Subscription table using Prisma
    await prisma.subscription.delete({
      where: {
        subscription_id: subscriptionId,
      },
    })

    res.json({ message: 'Subscription deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
