import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { authenticate, optionalAuthenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { updateProfileSchema } from '../utils/validators'

const router = Router()

// Public
router.get('/:username',             userController.getProfile)
router.get('/:username/books',       userController.getUserBooks)
router.get('/:username/following',   optionalAuthenticate, userController.getFollowStatus)

// Protected
router.patch('/me',                  authenticate, validate(updateProfileSchema), userController.updateProfile)
router.post('/:username/follow',     authenticate, userController.followUser)

export default router