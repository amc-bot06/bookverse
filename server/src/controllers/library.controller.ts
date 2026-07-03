import { Request, Response, NextFunction } from 'express'
import * as libraryService from '../services/library.service'
import { sendSuccess } from '../utils/apiResponse'

export const toggleBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await libraryService.toggleBookmark(
      req.user!.userId,
      req.params.bookId as string,
      req.body.chapterId
    )
    sendSuccess(res, result, result.bookmarked ? 'Bookmarked' : 'Removed bookmark')
  } catch (error) { next(error) }
}

export const getBookmarkStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await libraryService.getBookmarkStatus(
      req.user!.userId,
      req.params.chapterId as string
    )
    sendSuccess(res, result)
  } catch (error) { next(error) }
}

export const toggleSavedBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await libraryService.toggleSavedBook(
      req.user!.userId,
      req.params.bookId as string
    )
    sendSuccess(res, result, result.saved ? 'Saved' : 'Removed from saved')
  } catch (error) { next(error) }
}

export const getSavedBookStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await libraryService.getSavedBookStatus(
      req.user!.userId,
      req.params.bookId as string
    )
    sendSuccess(res, result)
  } catch (error) { next(error) }
}

export const getUserSavedBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const savedBooks = await libraryService.getUserSavedBooks(req.user!.userId)
    sendSuccess(res, savedBooks)
  } catch (error) { next(error) }
}

export const getUserBookmarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookmarks = await libraryService.getUserBookmarks(req.user!.userId)
    sendSuccess(res, bookmarks)
  } catch (error) { next(error) }
}

export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await libraryService.updateReadingProgress(
      req.user!.userId,
      req.params.bookId as string,
      req.body.chapterId,
      req.body.progress
    )
    sendSuccess(res, result)
  } catch (error) { next(error) }
}

export const getContinueReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await libraryService.getContinueReading(req.user!.userId)
    sendSuccess(res, progress)
  } catch (error) { next(error) }
}