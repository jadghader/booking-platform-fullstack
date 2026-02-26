import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import fs from 'fs'

const prisma = new PrismaClient()

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const targetDirectory = 'public/uploads/profile-pictures/'
    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true })
    }
    callback(null, targetDirectory)
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    // Access the uploaded file
    const uploadedFile = req.file

    // Ensure a file was uploaded
    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    const user: any = req.user // Retrieve user information from the authenticated user

    // Get the user's ID from the request (customize this part)
    const userId = user?.userId

    // Process the file and save it to a permanent location
    const profilePicturePath = uploadedFile.filename // Customize the filename or path as needed

    // Update the user's profile with the file path or reference
    await prisma.user.update({
      where: { user_id: userId },
      data: { profile_picture: profilePicturePath },
    })

    res.json({ message: 'File uploaded and user profile updated successfully' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'An error occurred' })
  }
}

export { uploadProfilePicture }
