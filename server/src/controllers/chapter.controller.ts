import { Request, Response, NextFunction } from 'express'
import * as chapterService from '../services/chapter.service'
import { sendSuccess } from '../utils/apiResponse'

export const createChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapter = await chapterService.createChapter(
      req.params.bookId as string,
      req.user!.userId,
      req.body
    )
    sendSuccess(res, chapter, 'Chapter created', 201)
  } catch (error) { next(error) }
}

export const getChapters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAuthor = !!req.user
    const chapters = await chapterService.getChaptersByBook(
      req.params.bookId as string,
      isAuthor
    )
    sendSuccess(res, chapters)
  } catch (error) { next(error) }
}

export const getChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapter = await chapterService.getChapterById(
      req.params.chapterId as string,
      req.user?.userId
    )
    sendSuccess(res, chapter)
  } catch (error) { next(error) }
}

export const updateChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapter = await chapterService.updateChapter(
      req.params.chapterId as string,
      req.user!.userId,
      req.body
    )
    sendSuccess(res, chapter, 'Chapter updated')
  } catch (error) { next(error) }
}

export const deleteChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await chapterService.deleteChapter(
      req.params.chapterId as string,
      req.user!.userId
    )
    sendSuccess(res, null, 'Chapter deleted')
  } catch (error) { next(error) }
}

export const togglePublish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chapter = await chapterService.togglePublish(
      req.params.chapterId as string,
      req.user!.userId
    )
    sendSuccess(res, chapter, `Chapter ${chapter.published ? 'published' : 'unpublished'}`)
  } catch (error) { next(error) }
}