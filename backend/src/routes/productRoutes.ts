import { Router } from 'express'
import { getAllProducts, getFeaturedProducts, getBestSellers, getProductById, searchProducts } from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/bestsellers', getBestSellers)
router.get('/search', searchProducts)
router.get('/:id', getProductById)

export default router