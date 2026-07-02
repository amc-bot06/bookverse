import { Request, Response, NextFunction } from 'express'
import * as userService from '../services/user.service'
import { sendSuccess } from '../utils/apiResponse'

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserProfile(req.params.username as string)
    sendSuccess(res, user)
  } catch (error) { next(error) }
}

export const getUserBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await userService.getUserBooks(req.params.username as string)
    sendSuccess(res, books)
  } catch (error) { next(error) }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateProfile(req.user!.userId, req.body)
    sendSuccess(res, user, 'Profile updated')
  } catch (error) { next(error) }
}

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUser = await userService.getUserProfile(req.params.username as string)
    const result = await userService.followUser(req.user!.userId, targetUser.id)
    sendSuccess(res, result, result.following ? 'Followed' : 'Unfollowed')
  } catch (error) { next(error) }
}

export const getFollowStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      sendSuccess(res, { following: false })
      return
    }
    const targetUser = await userService.getUserProfile(req.params.username as string)
    const following = await userService.isFollowing(req.user.userId, targetUser.id)
    sendSuccess(res, { following })
  } catch (error) { next(error) }
}