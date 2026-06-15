import { Request, Response } from 'express';
import prisma from '../config/database';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('GET MESSAGES ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, is_read } = req.body;

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(id as string) },
      data: {
        ...(status && { status }),
        ...(is_read !== undefined && { is_read })
      }
    });

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('UPDATE MESSAGE STATUS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id: parseInt(id as string) }
    });

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('DELETE MESSAGE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
