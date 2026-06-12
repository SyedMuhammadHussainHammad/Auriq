import { Router } from 'express'
import { getProducts, getProductById, searchProducts } from '../controllers/productController'

const router = Router()

router.get('/', getProducts)
router.get('/search', searchProducts)
router.get('/:id', getProductById)

export default router