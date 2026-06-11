import { Router } from 'express'
import { register, login, logout, refreshAccessToken } from '../controllers/authController'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)

export default router