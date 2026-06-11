import { Request, Response } from 'express';
import prisma from '../config/database';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, is_active } = req.body;
    
    const category = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        is_active: is_active ?? true
      }
    });

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('CREATE CATEGORY ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;
    
    const category = await prisma.category.update({
      where: { id: parseInt(id as string) },
      data: {
        name,
        slug: name ? name.toLowerCase().replace(/ /g, '-') : undefined,
        is_active
      }
    });

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('UPDATE CATEGORY ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
