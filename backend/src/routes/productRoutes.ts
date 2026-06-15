import { Router } from 'express'
import { getAllProducts, getFeaturedProducts, getBestSellers, getProductById, searchProducts, generateMerchantCenterFeed } from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/bestsellers', getBestSellers)
router.get('/search', searchProducts)
router.get('/feed/merchant-center', generateMerchantCenterFeed)
router.get('/:id', getProductById)

export default router