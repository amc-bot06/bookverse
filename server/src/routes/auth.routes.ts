import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { signupSchema, loginSchema } from '../utils/validators'

const router = Router()

router.post('/signup', validate(signupSchema), authController.signup)
router.post('/login',  validate(loginSchema),  authController.login)
router.get('/me',      authenticate,           authController.getMe)

export default router