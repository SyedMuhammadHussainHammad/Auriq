import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { name: true } },
        user: { select: { name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('GET ALL REVIEWS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const review = await prisma.review.update({
      where: { id: parseInt(id as string) },
      data: { is_active }
    });

    res.json({ success: true, data: review, message: is_active ? 'Review approved' : 'Review hidden' });
  } catch (error) {
    console.error('UPDATE REVIEW STATUS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
