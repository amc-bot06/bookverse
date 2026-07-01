import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { CreateChapterInput, UpdateChapterInput } from '../utils/validators'

// ─── Create Chapter ───────────────────────────────────────────────────────────
export const createChapter = async (
  bookId: string,
  authorId: string,
  input: CreateChapterInput
) => {
  // Verify the book exists and belongs to this author
  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book) throw new AppError('Book not found', 404)
  if (book.authorId !== authorId) throw new AppError('Not authorized', 403)

  // Check chapter number isn't already taken
  const existing = await prisma.chapter.findUnique({
    where: { bookId_chapterNumber: { bookId, chapterNumber: input.chapterNumber } },
  })
  if (existing) throw new AppError(`Chapter ${input.chapterNumber} already exists`, 409)

  return prisma.chapter.create({
    data: { ...input, bookId },
  })
}

// ─── Get All Chapters for a Book ─────────────────────────────────────────────
export const getChaptersByBook = async (bookId: string, includeUnpublished = false) => {
  return prisma.chapter.findMany({
    where: {
      bookId,
      ...(!includeUnpublished && { published: true }),
    },
    orderBy: { chapterNumber: 'asc' },
    select: {
      id: true,
      title: true,
      chapterNumber: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

// ─── Get Single Chapter ───────────────────────────────────────────────────────
export const getChapterById = async (chapterId: string, userId?: string) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          authorId: true,
          author: { select: { id: true, username: true, avatar: true } },
        },
      },
    },
  })

  if (!chapter) throw new AppError('Chapter not found', 404)

  // Unpublished chapters can only be read by the author
  if (!chapter.published && chapter.book.authorId !== userId) {
    throw new AppError('This chapter is not published yet', 403)
  }

  return chapter
}

// ─── Update Chapter ───────────────────────────────────────────────────────────
export const updateChapter = async (
  chapterId: string,
  authorId: string,
  input: UpdateChapterInput
) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { book: true },
  })

  if (!chapter) throw new AppError('Chapter not found', 404)
  if (chapter.book.authorId !== authorId) throw new AppError('Not authorized', 403)

  return prisma.chapter.update({
    where: { id: chapterId },
    data: input,
  })
}

// ─── Delete Chapter ───────────────────────────────────────────────────────────
export const deleteChapter = async (chapterId: string, authorId: string) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { book: true },
  })

  if (!chapter) throw new AppError('Chapter not found', 404)
  if (chapter.book.authorId !== authorId) throw new AppError('Not authorized', 403)

  await prisma.chapter.delete({ where: { id: chapterId } })
}

// ─── Publish / Unpublish Chapter ─────────────────────────────────────────────
export const togglePublish = async (chapterId: string, authorId: string) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { book: true },
  })

  if (!chapter) throw new AppError('Chapter not found', 404)
  if (chapter.book.authorId !== authorId) throw new AppError('Not authorized', 403)

  return prisma.chapter.update({
    where: { id: chapterId },
    data: { published: !chapter.published },
  })
}