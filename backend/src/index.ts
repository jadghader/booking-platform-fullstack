import express, { Express } from 'express'
import userRoutes from './routes/userRoutes'
import serviceRoutes from './routes/serviceRoutes'
import 'reflect-metadata'
import cors from 'cors'
import bodyParser from 'body-parser'
import subscriptionRoutes from './routes/subscriptionRoutes'
import reviewRoutes from './routes/reviewRoutes'
import bookingRoutes from './routes/bookingRoutes'
import authRoutes from './routes/authRoutes'
import cookieParser from 'cookie-parser'
import { env } from './config/env'

const expressServer: Express = express()
const port = env.PORT

expressServer.use(bodyParser.json())
expressServer.use(cookieParser())
expressServer.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  }),
)
// Use the verification router at the specified URL
expressServer.use('/api/user', userRoutes)
expressServer.use('/api/service', serviceRoutes)
expressServer.use('/api/subscription', subscriptionRoutes)
expressServer.use('/api/review', reviewRoutes)
expressServer.use('/api/booking', bookingRoutes)
expressServer.use('/api/auth', authRoutes)

expressServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

export default expressServer
