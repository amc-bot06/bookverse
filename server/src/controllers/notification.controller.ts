import { Request, Response, NextFunction } from 'express'
import * as notificationService from '../services/notification.service'
import { sendSuccess } from '../utils/apiResponse'

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await notificationService.getNotifications(req.user!.userId)
    sendSuccess(res, notifications)
  } catch (error) { next(error) }
}

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.getUnreadCount(req.user!.userId)
    sendSuccess(res, result)
  } catch (error) { next(error) }
}

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAllRead(req.user!.userId)
    sendSuccess(res, null, 'All notifications marked as read')
  } catch (error) { next(error) }
}

export const markOneRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.markOneRead(
      req.params.id as string,
      req.user!.userId
    )
    sendSuccess(res, null, 'Notification marked as read')
  } catch (error) { next(error) }
}