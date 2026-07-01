import { Router } from 'express'
import * as chapterController from '../controllers/chapter.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createChapterSchema, updateChapterSchema } from '../utils/validators'

const router = Router({ mergeParams: true })

router.get('/',            chapterController.getChapters)
router.get('/:chapterId',  chapterController.getChapter)

router.post('/',
  authenticate,
  validate(createChapterSchema),
  chapterController.createChapter
)
router.patch('/:chapterId',
  authenticate,
  validate(updateChapterSchema),
  chapterController.updateChapter
)
router.delete('/:chapterId',
  authenticate,
  chapterController.deleteChapter
)
router.patch('/:chapterId/publish',
  authenticate,
  chapterController.togglePublish
)

export default router