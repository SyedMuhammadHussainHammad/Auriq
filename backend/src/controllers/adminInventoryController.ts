import { Request, Response } from 'express';
import prisma from '../config/database';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: { name: true, brand: true, is_active: true }
        }
      },
      orderBy: {
        stock_quantity: 'asc'
      }
    });

    const inventory = variants.map(v => ({
      id: v.id,
      productName: v.product.name,
      brand: v.product.brand,
      size: v.size_ml,
      sku: v.sku,
      price: v.price,
      stock: v.stock_quantity,
      lowStockAlert: v.low_stock_alert,
      isActive: v.is_active && v.product.is_active,
      status: v.stock_quantity === 0 ? 'Out of Stock' : (v.stock_quantity <= v.low_stock_alert ? 'Low Stock' : 'In Stock')
    }));

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error('INVENTORY ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
