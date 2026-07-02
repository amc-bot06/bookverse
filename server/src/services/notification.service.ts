import { prisma } from '../config/database'
import { NotificationType } from '@prisma/client'
import { AppError } from '../middleware/errorHandler'

// ─── Create Notification ──────────────────────────────────────────────────────
export const createNotification = async (
  userId: string,
  type: NotificationType,
  message: string,
  link?: string
) => {
  // Don't notify yourself
  return prisma.notification.create({
    data: { userId, type, message, link },
  })
}

// ─── Get User Notifications ───────────────────────────────────────────────────
export const getNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })
}

// ─── Get Unread Count ─────────────────────────────────────────────────────────
export const getUnreadCount = async (userId: string) => {
  const count = await prisma.notification.count({
    where: { userId, read: false },
  })
  return { count }
}

// ─── Mark All as Read ─────────────────────────────────────────────────────────
export const markAllRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })
}

// ─── Mark One as Read ─────────────────────────────────────────────────────────
export const markOneRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
  if (!notification) throw new AppError('Notification not found', 404)
  if (notification.userId !== userId) throw new AppError('Not authorized', 403)

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  })
}