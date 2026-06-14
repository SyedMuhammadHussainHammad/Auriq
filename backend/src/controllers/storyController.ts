import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinary';

const prisma = new PrismaClient();

export const getStory = async (req: Request, res: Response) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: 1 }
    });

    if (!story) {
      // Return default if not found
      return res.json({
        success: true,
        data: {
          subtitle: "The Heritage",
          title: "Crafting The Essence Of Elegance",
          paragraph1: "Every drop of Auriq is a testament to the art of fine perfumery. We source the rarest, most exquisite ingredients from across the globe—from the fields of Grasse to the deep forests of the East—to create fragrances that are not just scents, but timeless memories.",
          paragraph2: "Our master perfumers blend traditional techniques with modern innovation, ensuring that every bottle holds a symphony of notes that evolve beautifully on your skin throughout the day.",
          image1_url: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2787&auto=format&fit=crop",
          image2_url: null
        }
      });
    }

    res.json({ success: true, data: story });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateStory = async (req: Request, res: Response) => {
  try {
    const { subtitle, title, paragraph1, paragraph2 } = req.body;
    
    // Existing story to get old images if new ones aren't uploaded
    const existingStory = await prisma.story.findUnique({ where: { id: 1 } });
    
    let image1_url = existingStory?.image1_url || "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2787&auto=format&fit=crop";
    let image2_url = existingStory?.image2_url || null;

    // Handle uploaded images
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const url = await uploadToCloudinary(file.buffer);
        // We use fieldname or order to determine which image is which, but with multer .array() we just get an array.
        // Let's assume the client sends them as separate fields for clarity, or we just replace them in order.
        // Actually, let's use upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}]) in route.
        if (file.fieldname === 'image1') image1_url = url;
        if (file.fieldname === 'image2') image2_url = url;
      }
    }

    const story = await prisma.story.upsert({
      where: { id: 1 },
      update: {
        subtitle,
        title,
        paragraph1,
        paragraph2,
        image1_url,
        image2_url
      },
      create: {
        id: 1,
        subtitle,
        title,
        paragraph1,
        paragraph2,
        image1_url,
        image2_url
      }
    });

    res.json({ success: true, data: story, message: 'Story updated successfully' });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ success: false, message: 'Failed to update story' });
  }
};
