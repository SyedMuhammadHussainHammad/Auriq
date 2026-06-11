import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { verifyUser } from '../middleware/authMiddleware';

const router = Router();

// Protect all wishlist routes
router.use(verifyUser);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);

export default router;
