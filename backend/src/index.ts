import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { ENV } from './config/env'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Auriq API is running' })
})

// Global error handler
app.use(errorHandler)

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`)
})