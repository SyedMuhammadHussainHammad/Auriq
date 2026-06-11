import { Router } from 'express'
import { register, login, logout, refreshAccessToken, googleLogin, facebookLogin } from '../controllers/authController'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)
router.post('/google', googleLogin)
router.post('/facebook', facebookLogin)

export default router