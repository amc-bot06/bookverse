import { Router } from 'express'
import * as libraryController from '../controllers/library.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// All library routes require authentication
router.use(authenticate)

router.get('/bookmarks',                    libraryController.getUserBookmarks)
router.post('/bookmarks/:bookId',           libraryController.toggleBookmark)
router.get('/bookmarks/chapter/:chapterId', libraryController.getBookmarkStatus)
router.post('/progress/:bookId',            libraryController.updateProgress)
router.get('/continue-reading',             libraryController.getContinueReading)

export default router