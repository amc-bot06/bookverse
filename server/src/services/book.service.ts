import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { CreateBookInput, UpdateBookInput } from '../utils/validators'
import { notifyFollowersOfNewBook } from './notification.service'

// ─── Create ──────────────────────────────────────────────────────────────────
export const createBook = async (
  authorId: string,
  input: CreateBookInput
) => {
  const { title, description, genres, tags, language, plannedChapters, coverImage } = input

  // Verify all genre IDs exist
  const genreRecords = await prisma.genre.findMany({
    where: { id: { in: genres } },
  })

  if (genreRecords.length !== genres.length) {
    throw new AppError('One or more genres are invalid', 400)
  }

  const book = await prisma.book.create({
  data: {
    title,
    description,
    tags,
    language,
    plannedChapters,
    coverImage,
    status: 'ONGOING',
    authorId,
    genres: {
      create: genres.map((genreId) => ({ genreId })),
    },
  },
    include: {
      author: {
        select: { id: true, username: true, avatar: true },
      },
      genres: {
        include: { genre: true },
      },
      _count: {
        select: { chapters: true, likes: true, comments: true },
      },
    },
  })

  await notifyFollowersOfNewBook(authorId, book.id, book.title)

  return book
}

// ─── Get Single Book ─────────────────────────────────────────────────────────
export const getBookById = async (
  bookId: string,
  viewerId?: string,
  guestId?: string
) => {
  const [book, publishedChapterCount] = await Promise.all([
    prisma.book.findUnique({
      where: { id: bookId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
            _count: { select: { followers: true } },
          },
        },
        genres: { include: { genre: true } },
        _count: {
          select: { chapters: true, likes: true, comments: true },
        },
      },
    }),
    prisma.chapter.count({ where: { bookId, published: true } }),
  ])

  if (!book) throw new AppError('Book not found', 404)

  await recordUniqueView(bookId, viewerId, guestId)
  const freshViews = await prisma.book.findUnique({ where: { id: bookId }, select: { views: true } })

  return { ...book, views: freshViews?.views ?? book.views, publishedChapterCount }
}

// ─── Record a Unique View ─────────────────────────────────────────────────────
// Only increments the book's view counter the first time a given viewer
// (logged-in user or guest) is seen for this book. Relies on the BookView
// unique constraint + a try/catch instead of check-then-insert, so concurrent
// requests from the same viewer can't race past the check and double-count.
const recordUniqueView = async (bookId: string, viewerId?: string, guestId?: string) => {
  if (!viewerId && !guestId) return

  try {
    await prisma.bookView.create({
      data: {
        bookId,
        userId: viewerId ?? null,
        guestId: viewerId ? null : guestId ?? null,
      },
    })
    await prisma.book.update({
      where: { id: bookId },
      data: { views: { increment: 1 } },
    })
  } catch (err: any) {
    // P2002 = unique constraint violation — this viewer was already counted
    if (err.code !== 'P2002') throw err
  }
}

// ─── Get Trending Books ───────────────────────────────────────────────────────
export const getTrendingBooks = async (limit = 10) => {
  return prisma.book.findMany({
    where: { status: { not: 'DRAFT' } },
    orderBy: { views: 'desc' },
    take: limit,
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, likes: true, comments: true } },
    },
  })
}

// ─── Get Recent Books ─────────────────────────────────────────────────────────
export const getRecentBooks = async (limit = 10) => {
  return prisma.book.findMany({
    where: { status: { not: 'DRAFT' } },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, likes: true, comments: true } },
    },
  })
}

// ─── Get All Books (Paginated) ────────────────────────────────────────────────
export const getBooks = async (
  page = 1,
  limit = 20,
  search?: string,
  genre?: string,
  status?: string,
  sort = 'newest'
) => {
  const skip = (page - 1) * limit

  const where: any = {
    status: status
      ? status
      : { not: 'DRAFT' },
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(genre && {
      genres: {
        some: { genre: { slug: genre } },
      },
    }),
  }

  const orderBy: any =
    sort === 'trending'
      ? { views: 'desc' }
      : sort === 'popular'
      ? { likes: { _count: 'desc' } }
      : { createdAt: 'desc' }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        genres: { include: { genre: true } },
        _count: { select: { chapters: true, likes: true, comments: true } },
      },
    }),
    prisma.book.count({ where }),
  ])

  return { books, total }
}
// ─── Update Book ──────────────────────────────────────────────────────────────
export const updateBook = async (
  bookId: string,
  authorId: string,
  input: UpdateBookInput
) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } })

  if (!book) throw new AppError('Book not found', 404)
  if (book.authorId !== authorId) throw new AppError('Not authorized', 403)

  const { genres, ...rest } = input

  return prisma.book.update({
    where: { id: bookId },
    data: {
      ...rest,
      ...(genres && {
        genres: {
          deleteMany: {},
          create: genres.map((genreId) => ({ genreId })),
        },
      }),
    },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, likes: true, comments: true } },
    },
  })
}

// ─── Delete Book ──────────────────────────────────────────────────────────────
export const deleteBook = async (bookId: string, authorId: string) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } })

  if (!book) throw new AppError('Book not found', 404)
  if (book.authorId !== authorId) throw new AppError('Not authorized', 403)

  await prisma.book.delete({ where: { id: bookId } })
}

// ─── Get Genres ───────────────────────────────────────────────────────────────
export const getAllGenres = async () => {
  return prisma.genre.findMany({ orderBy: { name: 'asc' } })
}

// ─── Get Author's Books ───────────────────────────────────────────────────────
export const getBooksByAuthor = async (authorId: string) => {
  return prisma.book.findMany({
    where: { authorId },
    orderBy: { createdAt: 'desc' },
    include: {
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, likes: true, comments: true } },
    },
  })
}