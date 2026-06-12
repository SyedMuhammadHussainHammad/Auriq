import { Router } from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController'
import { protect } from '../middleware/authMiddleware'

const router = Router()

// Cart works for both logged-in users and guests
// protect middleware is optional here — it adds userId if token exists
router.get('/', protect, getCart)
router.post('/add', protect, addToCart)
router.put('/update', protect, updateCartItem)
router.delete('/remove', protect, removeFromCart)
router.delete('/clear', protect, clearCart)

export default router