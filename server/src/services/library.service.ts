import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'

// ─── Toggle Bookmark ──────────────────────────────────────────────────────────
export const toggleBookmark = async (
  userId: string,
  bookId: string,
  chapterId: string
) => {
  const existing = await prisma.bookmark.findUnique({
    where: { userId_chapterId: { userId, chapterId } },
  })

  if (existing) {
    await prisma.bookmark.delete({
      where: { userId_chapterId: { userId, chapterId } },
    })
    return { bookmarked: false }
  }

  await prisma.bookmark.create({ data: { userId, bookId, chapterId } })
  return { bookmarked: true }
}

// ─── Get Bookmark Status ──────────────────────────────────────────────────────
export const getBookmarkStatus = async (userId: string, chapterId: string) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_chapterId: { userId, chapterId } },
  })
  return { bookmarked: !!bookmark }
}

// ─── Get All Bookmarks ────────────────────────────────────────────────────────
export const getUserBookmarks = async (userId: string) => {
  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      book: {
        include: {
          author: { select: { id: true, username: true, avatar: true } },
          genres: { include: { genre: true } },
          _count: { select: { chapters: true, likes: true } },
        },
      },
      chapter: {
        select: { id: true, title: true, chapterNumber: true },
      },
    },
  })
}

// ─── Update Reading Progress ──────────────────────────────────────────────────
export const updateReadingProgress = async (
  userId: string,
  bookId: string,
  chapterId: string,
  progress: number
) => {
  return prisma.readingProgress.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: { chapterId, progress },
    create: { userId, bookId, chapterId, progress },
  })
}

// ─── Get Continue Reading ─────────────────────────────────────────────────────
export const getContinueReading = async (userId: string) => {
  return prisma.readingProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 6,
    include: {
      book: {
        include: {
          author: { select: { id: true, username: true, avatar: true } },
          genres: { include: { genre: true } },
          _count: { select: { chapters: true, likes: true } },
        },
      },
      chapter: {
        select: { id: true, title: true, chapterNumber: true },
      },
    },
  })
}