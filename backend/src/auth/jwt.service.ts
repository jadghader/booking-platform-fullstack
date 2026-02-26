import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'

type Secret = string

const accessSecretKey: Secret = env.ACCESS_SECRET_KEY
const refreshSecretKey: Secret = env.REFRESH_SECRET_KEY
const signOptions: SignOptions = { expiresIn: '15m', algorithm: 'HS256' }
const refreshSignOptions: SignOptions = {
  expiresIn: '7d', // Set the expiration time for the refresh token
  algorithm: 'HS256', // Specify the signing algorithm
}
export const generateAccessToken = (user: any): string => {
  const payload = {
    user_id: user?.user_id,
    role: user?.role,
    username: user?.userName,
    email: user?.email,
    emailValidate: user?.emailValidate,
  }

  return jwt.sign(payload, accessSecretKey, signOptions)
}

export const generateToken = (user: any): string => {
  const payload = {
    user_id: user?.user_id,
    role: user?.role,
    username: user?.userName,
    email: user?.email,
    emailValidate: user?.emailValidate,
  }

  return jwt.sign(payload, refreshSecretKey, refreshSignOptions)
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, accessSecretKey, { algorithms: ['HS256'] })
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, refreshSecretKey, { algorithms: ['HS256'] })
  } catch (error) {
    throw new Error('Invalid token')
  }
}
