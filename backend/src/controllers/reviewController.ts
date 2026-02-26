// Import required modules and schemas in your controller files.

// reviewController.ts
import { Request, Response } from 'express'
import db from '../db' // Import the database connection
import * as yup from 'yup' // Import the yup schema validation library

// Define the reviewSchema for validation
const reviewSchema = yup.object().shape({
  consumer_id: yup.number().required('Consumer ID is required'),
  provider_id: yup.number().required('Provider ID is required'),
  service_id: yup.number().required('Service ID is required'),
  rating: yup.number().required('Rating is required'),
  review_text: yup.string().required('Review text is required'),
  visible_to_admin: yup.boolean().required('Visibility is required'),
})

// Create review controller
export const createReview = async (req: Request, res: Response) => {
  try {
    const {
      consumer_id,
      provider_id,
      service_id,
      rating,
      review_text,
      visible_to_admin,
    } = req.body

    // Validate the request body against the reviewSchema
    try {
      await reviewSchema.validate({
        consumer_id,
        provider_id,
        service_id,
        rating,
        review_text,
        visible_to_admin,
      })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }

    // Insert data into the Review table
    const sql =
      'INSERT INTO Review (consumer_id, provider_id, service_id, rating, review_text, visible_to_admin) VALUES (?, ?, ?, ?, ?, ?)'
    const values = [
      consumer_id,
      provider_id,
      service_id,
      rating,
      review_text,
      visible_to_admin,
    ]

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred' })
      } else {
        res.json({ message: 'Review created successfully' })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
// Edit review controller
export const editReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId // Get the review ID from the URL parameter
    const {
      consumer_id,
      provider_id,
      service_id,
      rating,
      review_text,
      visible_to_admin,
    } = req.body

    // Validate the request body against the reviewSchema
    try {
      await reviewSchema.validate({
        consumer_id,
        provider_id,
        service_id,
        rating,
        review_text,
        visible_to_admin,
      })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }

    // Update review details in the Review table
    const sql =
      'UPDATE Review SET consumer_id = ?, provider_id = ?, service_id = ?, rating = ?, review_text = ?, visible_to_admin = ? WHERE review_id = ?'
    const values = [
      consumer_id,
      provider_id,
      service_id,
      rating,
      review_text,
      visible_to_admin,
      reviewId,
    ]

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred' })
      } else {
        res.json({ message: 'Review updated successfully' })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
// Delete review controller
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId // Get the review ID from the URL parameter

    // Delete review from the Review table
    const sql = 'DELETE FROM Review WHERE review_id = ?'

    db.query(sql, [reviewId], (error, result) => {
      if (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred' })
      } else {
        res.json({ message: 'Review deleted successfully' })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
// Get review controller
export const getReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId // Get the review ID from the URL parameter

    // Retrieve a specific review from the Review table
    const sql = 'SELECT * FROM Review WHERE review_id = ?'

    db.query(sql, [reviewId], (error, result) => {
      if (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred' })
      } else {
        if (String(result).length > 0) {
          res.json(result) // Send the review details
        } else {
          res.status(404).json({ message: 'Review not found' })
        }
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export const getAllReview = async (req: Request, res: Response) => {
  try {
    // Retrieve the minimum rating from the query parameters
    const minRating = req.query.minRating
      ? parseFloat(req.query.minRating as string)
      : 0

    // Construct the SQL query with a WHERE clause for minimum rating
    const sql = `SELECT * FROM Review WHERE rating >= ${minRating}`

    db.query(sql, (error, result) => {
      if (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred' })
      } else {
        if (String(result).length > 0) {
          res.json(result) // Send the review details
        } else {
          res.status(404).json({ message: 'Review not found' })
        }
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred' })
  }
}
