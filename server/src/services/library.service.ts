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

// ─── Toggle Saved Book ────────────────────────────────────────────────────────
export const toggleSavedBook = async (userId: string, bookId: string) => {
  const existing = await prisma.savedBook.findUnique({
    where: { userId_bookId: { userId, bookId } },
  })

  if (existing) {
    await prisma.savedBook.delete({
      where: { userId_bookId: { userId, bookId } },
    })
    return { saved: false }
  }

  await prisma.savedBook.create({ data: { userId, bookId } })
  return { saved: true }
}

// ─── Get Saved Book Status ────────────────────────────────────────────────────
export const getSavedBookStatus = async (userId: string, bookId: string) => {
  const saved = await prisma.savedBook.findUnique({
    where: { userId_bookId: { userId, bookId } },
  })
  return { saved: !!saved }
}

// ─── Get All Saved Books ──────────────────────────────────────────────────────
export const getUserSavedBooks = async (userId: string) => {
  return prisma.savedBook.findMany({
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
    },
  })
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