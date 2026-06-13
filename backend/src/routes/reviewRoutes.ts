import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController';
import { verifyUser } from '../middleware/authMiddleware';

const router = Router();

// POST /api/reviews
// Protected route: Only authenticated users can leave a review
router.post('/', verifyUser, addReview);

// GET /api/reviews/product/:id
// Public route: Anyone can see the reviews for a product
router.get('/product/:id', getProductReviews);

export default router;
