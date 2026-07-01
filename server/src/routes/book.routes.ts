import { Router } from 'express'
import * as bookController from '../controllers/book.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createBookSchema, updateBookSchema } from '../utils/validators'
import chapterRoutes from './chapter.routes'

const router = Router()

router.get('/',                 bookController.getBooks)
router.get('/trending',         bookController.getTrending)
router.get('/recent',           bookController.getRecent)
router.get('/genres',           bookController.getGenres)
router.get('/author/:authorId', bookController.getAuthorBooks)
router.get('/:id',              bookController.getBook)

router.post('/',      authenticate, validate(createBookSchema), bookController.createBook)
router.patch('/:id',  authenticate, validate(updateBookSchema), bookController.updateBook)
router.delete('/:id', authenticate,                             bookController.deleteBook)

export default router