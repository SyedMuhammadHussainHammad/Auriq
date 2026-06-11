import { Request, Response } from 'express'
import prisma from '../config/database'

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { sort_order: 'asc' } },
        fragrance_notes: true,
      }
    })
    res.json({ success: true, data: products })
  } catch (error) {
    console.error('GET ALL PRODUCTS ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true, is_featured: true },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { sort_order: 'asc' } },
      },
      take: 8
    })
    res.json({ success: true, data: products })
  } catch (error) {
    console.error('GET FEATURED PRODUCTS ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getBestSellers = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true, is_best_seller: true },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { sort_order: 'asc' } },
      },
      take: 8
    })
    res.json({ success: true, data: products })
  } catch (error) {
    console.error('GET BEST SELLERS ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { sort_order: 'asc' } },
        fragrance_notes: true,
      }
    })
    
    if (!product || !product.is_active) {
      res.status(404).json({ success: false, message: 'Product not found' })
      return;
    }
    
    res.json({ success: true, data: product })
  } catch (error) {
    console.error('GET PRODUCT BY ID ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
