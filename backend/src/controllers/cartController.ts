import { Request, Response } from 'express'
import prisma from '../config/database'
import { AuthRequest } from '../middleware/authMiddleware'

// helper — get or create cart
const getOrCreateCart = async (userId?: number, sessionId?: string) => {
  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { where: { is_primary: true }, take: 1 } }
                }
              }
            },
            bundle: true
          }
        }
      }
    })
    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: { where: { is_primary: true }, take: 1 } }
                  }
                }
              },
              bundle: true
            }
          }
        }
      })
    }
    return cart
  }

  if (sessionId) {
    let cart = await prisma.cart.findUnique({
      where: { session_id: sessionId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { images: { where: { is_primary: true }, take: 1 } }
                }
              }
            },
            bundle: true
          }
        }
      }
    })
    if (!cart) {
      cart = await prisma.cart.create({
        data: { session_id: sessionId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { images: { where: { is_primary: true }, take: 1 } }
                  }
                }
              },
              bundle: true
            }
          }
        }
      })
    }
    return cart
  }

  throw new Error('userId or sessionId required')
}

// GET /api/cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const sessionId = req.headers['x-session-id'] as string

    if (!userId && !sessionId) {
      res.status(400).json({ success: false, message: 'Auth or session required' })
      return
    }

    const cart = await getOrCreateCart(userId, sessionId)
    res.json({ success: true, data: cart })
  } catch (error) {
    console.error('GET CART ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/cart/add
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const sessionId = req.headers['x-session-id'] as string
    const { variant_id, bundle_id, quantity = 1 } = req.body

    if (!userId && !sessionId) {
      res.status(400).json({ success: false, message: 'Auth or session required' })
      return
    }

    if (!variant_id && !bundle_id) {
      res.status(400).json({ success: false, message: 'variant_id or bundle_id required' })
      return
    }

    // Check stock if variant
    if (variant_id) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variant_id }
      })
      if (!variant || !variant.is_active) {
        res.status(404).json({ success: false, message: 'Product variant not found' })
        return
      }
      if (variant.stock_quantity < quantity) {
        res.status(400).json({ success: false, message: 'Not enough stock' })
        return
      }
    }

    const cart = await getOrCreateCart(userId, sessionId)

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        variant_id: variant_id || null,
        bundle_id: bundle_id || null
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          variant_id: variant_id || null,
          bundle_id: bundle_id || null,
          quantity
        }
      })
    }

    const updatedCart = await getOrCreateCart(userId, sessionId)
    res.json({ success: true, message: 'Added to cart', data: updatedCart })
  } catch (error) {
    console.error('ADD TO CART ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// PUT /api/cart/update
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const sessionId = req.headers['x-session-id'] as string
    const { item_id, quantity } = req.body

    if (!item_id || quantity === undefined) {
      res.status(400).json({ success: false, message: 'item_id and quantity required' })
      return
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item_id } })
      res.json({ success: true, message: 'Item removed from cart' })
      return
    }

    await prisma.cartItem.update({
      where: { id: item_id },
      data: { quantity }
    })

    const updatedCart = await getOrCreateCart(userId, sessionId)
    res.json({ success: true, message: 'Cart updated', data: updatedCart })
  } catch (error) {
    console.error('UPDATE CART ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// DELETE /api/cart/remove
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const sessionId = req.headers['x-session-id'] as string
    const { item_id } = req.body

    if (!item_id) {
      res.status(400).json({ success: false, message: 'item_id required' })
      return
    }

    await prisma.cartItem.delete({ where: { id: item_id } })

    const updatedCart = await getOrCreateCart(userId, sessionId)
    res.json({ success: true, message: 'Item removed', data: updatedCart })
  } catch (error) {
    console.error('REMOVE FROM CART ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// DELETE /api/cart/clear
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const sessionId = req.headers['x-session-id'] as string

    const cart = await getOrCreateCart(userId, sessionId)

    await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } })

    res.json({ success: true, message: 'Cart cleared' })
  } catch (error) {
    console.error('CLEAR CART ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}