import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { ENV } from '../config/env';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Hardcoded mock admin login
    if (email === 'admin@auriq.com' && password === 'password123') {
      const adminId = 9999;
      const accessToken = jwt.sign(
        { id: adminId, email, role: 'ADMIN' },
        ENV.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      
      const refreshToken = jwt.sign(
        { id: adminId, role: 'ADMIN' },
        ENV.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          admin: { id: adminId, name: 'Auriq Admin', email },
          accessToken,
          refreshToken
        }
      });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, role: 'ADMIN' },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, role: 'ADMIN' },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    try {
      await prisma.adminRefreshToken.create({
        data: {
          token: refreshToken,
          admin_id: admin.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });
    } catch (dbError) {
      console.warn('Could not save refresh token to DB, skipping:', dbError);
    }

    res.json({
      success: true,
      data: {
        admin: { id: admin.id, name: admin.name, email: admin.email },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('ADMIN LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
