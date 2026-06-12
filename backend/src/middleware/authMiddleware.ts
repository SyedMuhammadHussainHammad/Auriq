import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  userId?: number
}

// Required auth — blocks if no token
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Don't block — allow guest access
      next()
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)
    req.userId = decoded.userId
    next()
  } catch (error) {
    // Invalid token — still allow as guest
    next()
  }
}

// Strict auth — blocks guests completely
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Not authorized' })
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
}