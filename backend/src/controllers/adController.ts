import { Request, Response } from 'express'
import prisma from '../config/database'

export const getActiveAds = async (req: Request, res: Response) => {
  try {
    const ads = await prisma.ad.findMany({
      where: { 
        is_active: true,
        OR: [
          { starts_at: null, ends_at: null },
          { starts_at: { lte: new Date() }, ends_at: { gte: new Date() } }
        ]
      },
      orderBy: { created_at: 'desc' }
    })
    res.json({ success: true, data: ads })
  } catch (error) {
    console.error('GET ACTIVE ADS ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
