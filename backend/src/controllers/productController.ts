import { Request, Response } from 'express'
import prisma from '../config/database'

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      gender,
      fragrance_type,
      featured,
      best_seller,
      new_arrival,
      page = '1',
      limit = '12'
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = { is_active: true }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    if (category) where.category = { slug: category as string }
    if (gender) where.gender = (gender as string).toUpperCase()
    if (fragrance_type) where.fragrance_type = { contains: fragrance_type as string, mode: 'insensitive' }
    if (featured === 'true') where.is_featured = true
    if (best_seller === 'true') where.is_best_seller = true
    if (new_arrival === 'true') where.is_new_arrival = true

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { created_at: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
          images: { where: { is_primary: true }, take: 1 },
          variants: {
            where: { is_active: true },
            orderBy: { size_ml: 'asc' },
            select: {
              id: true,
              size_ml: true,
              price: true,
              discount_price: true,
              stock_quantity: true,
              sku: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          total_pages: Math.ceil(total / limitNum)
        }
      }
    })
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const idStr = Array.isArray(id) ? id[0] : id
    const idNum = parseInt(idStr)

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          ...(isNaN(idNum) ? [] : [{ id: idNum }]),
          { slug: idStr }
        ],
        is_active: true
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { sort_order: 'asc' } },
        variants: {
          where: { is_active: true },
          orderBy: { size_ml: 'asc' }
        },
        fragrance_notes: true,
        reviews: {
          where: { is_active: true },
          include: {
            user: { select: { name: true } }
          },
          orderBy: { created_at: 'desc' },
          take: 10
        },
        collections: {
          include: {
            collection: { select: { name: true, slug: true } }
          }
        }
      }
    })

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' })
      return
    }

    const reviews = product.reviews
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0

    res.json({
      success: true,
      data: {
        ...product,
        avg_rating: Math.round(avgRating * 10) / 10,
        review_count: reviews.length
      }
    })
  } catch (error) {
    console.error('GET PRODUCT ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// GET /api/products/search
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { q } = req.query

    if (!q) {
      res.status(400).json({ success: false, message: 'Search query required' })
      return
    }

    const products = await prisma.product.findMany({
      where: {
        is_active: true,
        OR: [
          { name: { contains: q as string, mode: 'insensitive' } },
          { brand: { contains: q as string, mode: 'insensitive' } },
          { fragrance_type: { contains: q as string, mode: 'insensitive' } },
        ]
      },
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        images: { where: { is_primary: true }, take: 1 },
        variants: {
          where: { is_active: true },
          orderBy: { price: 'asc' },
          take: 1,
          select: { price: true, discount_price: true }
        }
      }
    })

    res.json({ success: true, data: products })
  } catch (error) {
    console.error('SEARCH ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
