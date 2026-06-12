import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import { ENV } from './config/env'
import authRoutes from './routes/authRoutes'
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import cartRoutes from './routes/cartRoutes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Auriq API is running' })
})

app.use(errorHandler)

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`)
})