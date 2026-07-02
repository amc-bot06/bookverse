import { Request, Response, NextFunction } from 'express'
import * as interactionService from '../services/interaction.service'
import { sendSuccess } from '../utils/apiResponse'

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await interactionService.toggleLike(
      req.user!.userId,
      req.params.bookId as string
    )
    sendSuccess(res, result, result.liked ? 'Liked' : 'Unliked')
  } catch (error) { next(error) }
}

export const getLikeStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const count = await interactionService.getLikeStatus('', req.params.bookId as string)
      sendSuccess(res, { liked: false, count: count.count })
      return
    }
    const result = await interactionService.getLikeStatus(
      req.user.userId,
      req.params.bookId as string
    )
    sendSuccess(res, result)
  } catch (error) { next(error) }
}

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await interactionService.getComments(req.params.bookId as string)
    sendSuccess(res, comments)
  } catch (error) { next(error) }
}

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await interactionService.addComment(
      req.user!.userId,
      req.params.bookId as string,
      req.body.content,
      req.body.chapterId
    )
    sendSuccess(res, comment, 'Comment added', 201)
  } catch (error) { next(error) }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await interactionService.deleteComment(
      req.params.commentId as string,
      req.user!.userId
    )
    sendSuccess(res, null, 'Comment deleted')
  } catch (error) { next(error) }
}