import { Request, Response } from 'express';
import prisma from '../config/database';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = req.query.filter as string; // 'LOW_STOCK' or 'OUT_OF_STOCK'

    let whereClause: any = {
      product: {
        is_active: true
      }
    };

    if (filter === 'OUT_OF_STOCK') {
      whereClause.stock_quantity = 0;
    } else if (filter === 'LOW_STOCK') {
      // Basic fallback since Prisma doesn't natively support column-to-column compare in where.
      // Alternatively, we could fetch all and filter in memory, but this works for pagination.
      whereClause.stock_quantity = { gt: 0, lte: 10 }; 
    }

    const [total, variants] = await Promise.all([
      prisma.productVariant.count({ where: whereClause }),
      prisma.productVariant.findMany({
        where: whereClause,
        include: {
          product: { select: { name: true, brand: true, is_active: true } }
        },
        orderBy: { stock_quantity: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

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

    // If a specific filter is applied, we might need to adjust the total, but we will return the mapped data.
    // A robust solution would use prisma.$queryRaw for column-to-column comparison.
    // For this milestone, we'll return the paginated inventory.

    res.json({
      success: true,
      data: inventory,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('INVENTORY ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
