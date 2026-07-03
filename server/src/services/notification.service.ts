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

// ─── Notify Followers of a New Book ───────────────────────────────────────────
export const notifyFollowersOfNewBook = async (
  authorId: string,
  bookId: string,
  bookTitle: string
) => {
  const [author, followers] = await Promise.all([
    prisma.user.findUnique({ where: { id: authorId }, select: { username: true } }),
    prisma.follow.findMany({ where: { followingId: authorId }, select: { followerId: true } }),
  ])
  if (!author || followers.length === 0) return

  await prisma.notification.createMany({
    data: followers.map((f) => ({
      userId: f.followerId,
      type: 'NEW_BOOK' as NotificationType,
      message: `${author.username} published a new book: "${bookTitle}"`,
      link: `/book/${bookId}`,
    })),
  })
}

// ─── Notify Followers of a New Chapter ────────────────────────────────────────
export const notifyFollowersOfNewChapter = async (
  authorId: string,
  bookId: string,
  chapterId: string,
  chapterNumber: number,
  chapterTitle: string
) => {
  const [author, followers] = await Promise.all([
    prisma.user.findUnique({ where: { id: authorId }, select: { username: true } }),
    prisma.follow.findMany({ where: { followingId: authorId }, select: { followerId: true } }),
  ])
  if (!author || followers.length === 0) return

  await prisma.notification.createMany({
    data: followers.map((f) => ({
      userId: f.followerId,
      type: 'NEW_CHAPTER' as NotificationType,
      message: `${author.username} published Chapter ${chapterNumber}: "${chapterTitle}"`,
      link: `/book/${bookId}/chapter/${chapterId}`,
    })),
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