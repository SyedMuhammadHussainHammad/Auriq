import { Request, Response } from 'express';
import prisma from '../config/database';
import cloudinary from '../config/cloudinary';
import axios from 'axios';
import { ENV } from '../config/env';

const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'auriq_ads' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    uploadStream.end(buffer);
  });
};

const revalidateFrontend = async (tag: string) => {
  try {
    await axios.post('http://localhost:3000/api/revalidate', {
      tag,
      secret: ENV.REVALIDATION_SECRET
    });
  } catch (error) {
    console.error('Failed to revalidate frontend cache:', error);
  }
};

export const createAd = async (req: Request, res: Response) => {
  try {
    const { title, link_url, position, is_active } = req.body;
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({ success: false, message: 'Image is required' });
      return;
    }

    const uploadResult = await uploadToCloudinary(file.buffer);

    const ad = await prisma.ad.create({
      data: {
        title,
        link_url,
        position,
        is_active: is_active === 'true',
        image_url: uploadResult.secure_url
      }
    });

    await revalidateFrontend('ads');

    res.json({ success: true, data: ad });
  } catch (error) {
    console.error('CREATE AD ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: ads });
  } catch (error) {
    console.error('GET ALL ADS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
