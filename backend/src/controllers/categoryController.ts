import { Request, Response } from 'express'
import prisma from '../config/database'

// GET /api/categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } }
      }
    })

    res.json({ success: true, data: categories })
  } catch (error) {
    console.error('GET CATEGORIES ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/categories/:slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string

    const category = await prisma.category.findUnique({
      where: { slug: slug },
      include: {
        _count: { select: { products: true } }
      }
    })

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' })
      return
    }

    res.json({ success: true, data: category })
  } catch (error) {
    console.error('GET CATEGORY ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}