import { Request, Response } from 'express'
import prisma from '../config/database'

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      include: {
        products: {
          take: 4,
          include: {
            images: { orderBy: { sort_order: 'asc' }, take: 1 }
          }
        }
      }
    })
    res.json({ success: true, data: categories })
  } catch (error) {
    console.error('GET ALL CATEGORIES ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
