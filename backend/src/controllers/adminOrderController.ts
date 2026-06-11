import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        address: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('GET ALL ORDERS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(id as string) },
      data: { status }
    });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('UPDATE ORDER STATUS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
