import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/database'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone },
      select: { id: true, name: true, email: true, phone: true, created_at: true }
    })

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, accessToken, refreshToken }
    })
  } catch (error) {
    console.error('REGISTER ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: 'Account is deactivated' })
      return
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token required' })
      return
    }

    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })

    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('LOGOUT ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/auth/refresh
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token required' })
      return
    }

    const decoded = verifyRefreshToken(refreshToken)

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' })
      return
    }

    if (stored.expires_at < new Date()) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } })
      res.status(401).json({ success: false, message: 'Refresh token expired' })
      return
    }

    const accessToken = generateAccessToken(decoded.userId)

    res.json({ success: true, data: { accessToken } })
  } catch (error) {
    console.error('REFRESH ERROR:', error)
    res.status(401).json({ success: false, message: 'Invalid refresh token' })
  }
}