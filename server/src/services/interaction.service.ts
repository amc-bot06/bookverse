import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'

// ─── Toggle Like ──────────────────────────────────────────────────────────────
import { createNotification } from './notification.service'

export const toggleLike = async (userId: string, bookId: string) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { author: true },
  })
  if (!book) throw new AppError('Book not found', 404)

  const existing = await prisma.like.findUnique({
    where: { userId_bookId: { userId, bookId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { userId_bookId: { userId, bookId } } })
    return { liked: false }
  }

  await prisma.like.create({ data: { userId, bookId } })

  // Notify the author (but not if they liked their own book)
  if (book.authorId !== userId) {
    const liker = await prisma.user.findUnique({ where: { id: userId } })
    await createNotification(
      book.authorId,
      'NEW_LIKE',
      `${liker?.username} liked your book "${book.title}"`,
      `/book/${bookId}`
    )
  }

  return { liked: true }
}

// ─── Get Like Status ──────────────────────────────────────────────────────────
export const getLikeStatus = async (userId: string, bookId: string) => {
  const like = await prisma.like.findUnique({
    where: { userId_bookId: { userId, bookId } },
  })
  const count = await prisma.like.count({ where: { bookId } })
  return { liked: !!like, count }
}

// ─── Get Comments ─────────────────────────────────────────────────────────────
export const getComments = async (bookId: string) => {
  return prisma.comment.findMany({
    where: { bookId, chapterId: null },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, username: true, avatar: true },
      },
    },
  })
}

// ─── Add Comment ──────────────────────────────────────────────────────────────
export const addComment = async (
  userId: string,
  bookId: string,
  content: string,
  chapterId?: string
) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book) throw new AppError('Book not found', 404)

  const comment = await prisma.comment.create({
    data: { userId, bookId, content, chapterId },
    include: {
      user: {
        select: { id: true, username: true, avatar: true },
      },
    },
  })

  // Notify the author (but not if they commented on their own book)
  if (book.authorId !== userId) {
    const commenter = await prisma.user.findUnique({ where: { id: userId } })
    await createNotification(
      book.authorId,
      'NEW_COMMENT',
      `${commenter?.username} commented on your book "${book.title}"`,
      `/book/${bookId}`
    )
  }

  return comment
}

// ─── Update Comment ───────────────────────────────────────────────────────────
export const updateComment = async (commentId: string, userId: string, content: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw new AppError('Comment not found', 404)
  if (comment.userId !== userId) throw new AppError('Not authorized', 403)

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      user: {
        select: { id: true, username: true, avatar: true },
      },
    },
  })
}

// ─── Delete Comment ───────────────────────────────────────────────────────────
export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw new AppError('Comment not found', 404)
  if (comment.userId !== userId) throw new AppError('Not authorized', 403)

  await prisma.comment.delete({ where: { id: commentId } })
}