import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, getAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/userController';
import { verifyUser } from '../middleware/authMiddleware';

const router = Router();

// Protect all user routes
router.use(verifyUser);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

// Addresses
router.get('/addresses', getAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
