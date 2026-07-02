import { Router } from 'express'
import * as interactionController from '../controllers/interaction.controller'
import { authenticate, optionalAuthenticate } from '../middleware/auth'

const router = Router({ mergeParams: true })

// Likes
router.get('/like',    optionalAuthenticate, interactionController.getLikeStatus)
router.post('/like',   authenticate, interactionController.toggleLike)

// Comments
router.get('/comments',          interactionController.getComments)
router.post('/comments',         authenticate, interactionController.addComment)
router.delete('/comments/:commentId', authenticate, interactionController.deleteComment)

export default router