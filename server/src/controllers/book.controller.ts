import { Request, Response, NextFunction } from 'express'
import * as bookService from '../services/book.service'
import { sendSuccess, sendPaginated } from '../utils/apiResponse'

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookService.createBook(req.user!.userId, req.body)
    sendSuccess(res, book, 'Book created successfully', 201)
  } catch (error) { next(error) }
}

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookService.getBookById(req.params.id as string)
    sendSuccess(res, book)
  } catch (error) { next(error) }
}

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const search = req.query.search as string | undefined
    const { books, total } = await bookService.getBooks(page, limit, search)
    sendPaginated(res, books, total, page, limit)
  } catch (error) { next(error) }
}

export const getTrending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookService.getTrendingBooks()
    sendSuccess(res, books)
  } catch (error) { next(error) }
}

export const getRecent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookService.getRecentBooks()
    sendSuccess(res, books)
  } catch (error) { next(error) }
}

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookService.updateBook(req.params.id as string, req.user!.userId, req.body)
    sendSuccess(res, book, 'Book updated successfully')
  } catch (error) { next(error) }
}

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await bookService.deleteBook(req.params.id as string, req.user!.userId)
    sendSuccess(res, null, 'Book deleted successfully')
  } catch (error) { next(error) }
}


export const getGenres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genres = await bookService.getAllGenres()
    sendSuccess(res, genres)
  } catch (error) { next(error) }
}

export const getAuthorBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookService.getBooksByAuthor(req.params.authorId as string)
    sendSuccess(res, books)
  } catch (error) { next(error) }
}