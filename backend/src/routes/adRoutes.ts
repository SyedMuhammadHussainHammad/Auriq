import { Router } from 'express'
import { getActiveAds } from '../controllers/adController'

const router = Router()

router.get('/', getActiveAds)

export default router
