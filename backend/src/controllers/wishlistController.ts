import { Response } from 'express';
import prisma from '../config/database';
import { UserAuthRequest } from '../middleware/authMiddleware';

export const getWishlist = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let wishlist = await prisma.wishlist.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
                images: { orderBy: { sort_order: 'asc' } }
              }
            }
          }
        }
      }
    });

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = await prisma.wishlist.create({
        data: { user_id: userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  variants: true,
                  images: true
                }
              }
            }
          }
        }
      });
    }

    res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('GET WISHLIST ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addToWishlist = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { product_id } = req.body;

    if (!product_id) {
      res.status(400).json({ success: false, message: 'Product ID is required' });
      return;
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { user_id: userId } });
    
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { user_id: userId } });
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlist_id_product_id: {
          wishlist_id: wishlist.id,
          product_id: parseInt(product_id)
        }
      }
    });

    if (existingItem) {
      res.status(400).json({ success: false, message: 'Product already in wishlist' });
      return;
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlist_id: wishlist.id,
        product_id: parseInt(product_id)
      },
      include: {
        product: {
          include: { images: true, variants: true }
        }
      }
    });

    res.json({ success: true, data: wishlistItem, message: 'Added to wishlist' });
  } catch (error) {
    console.error('ADD TO WISHLIST ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeFromWishlist = async (req: UserAuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const productId = parseInt(req.params.productId as string);

    const wishlist = await prisma.wishlist.findUnique({ where: { user_id: userId } });
    if (!wishlist) {
      res.status(404).json({ success: false, message: 'Wishlist not found' });
      return;
    }

    await prisma.wishlistItem.delete({
      where: {
        wishlist_id_product_id: {
          wishlist_id: wishlist.id,
          product_id: productId
        }
      }
    });

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('REMOVE FROM WISHLIST ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
