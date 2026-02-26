import dotenv from 'dotenv'

dotenv.config()

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name]

  if (value && value.trim() !== '') {
    return value
  }

  if (fallback !== undefined) {
    return fallback
  }

  throw new Error(`Missing required environment variable: ${name}`)
}

export const env = {
  PORT: readEnv('PORT', '8000'),
  FRONTEND_URL: readEnv('FRONTEND_URL', 'http://localhost:3000'),
  ACCESS_SECRET_KEY: readEnv('ACCESS_SECRET_KEY'),
  REFRESH_SECRET_KEY: readEnv('REFRESH_SECRET_KEY'),
  EMAIL_HOST: readEnv('EMAIL_HOST', 'smtp.gmail.com'),
  EMAIL_PORT: Number(readEnv('EMAIL_PORT', '465')),
  EMAIL_SECURE: readEnv('EMAIL_SECURE', 'true') === 'true',
  EMAIL_NAME: readEnv('EMAIL_NAME'),
  EMAIL_PASSWORD: readEnv('EMAIL_PASSWORD'),
  EMAIL_FROM: readEnv('EMAIL_FROM'),
  CONTACT_RECIPIENT_EMAIL: readEnv('CONTACT_RECIPIENT_EMAIL'),
  DB_HOST: readEnv('DB_HOST'),
  DB_USER: readEnv('DB_USER'),
  DB_PASSWORD: readEnv('DB_PASSWORD'),
  DB_NAME: readEnv('DB_NAME'),
}
