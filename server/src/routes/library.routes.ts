import { Router } from 'express'
import * as libraryController from '../controllers/library.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// All library routes require authentication
router.use(authenticate)

router.get('/bookmarks',                    libraryController.getUserBookmarks)
router.post('/bookmarks/:bookId',           libraryController.toggleBookmark)
router.get('/bookmarks/chapter/:chapterId', libraryController.getBookmarkStatus)
router.get('/saved',                        libraryController.getUserSavedBooks)
router.get('/saved/:bookId',                libraryController.getSavedBookStatus)
router.post('/saved/:bookId',               libraryController.toggleSavedBook)
router.post('/progress/:bookId',            libraryController.updateProgress)
router.get('/continue-reading',             libraryController.getContinueReading)

export default router