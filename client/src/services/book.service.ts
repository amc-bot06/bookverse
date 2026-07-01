import api from './api'
import type { Book } from '../types'

export const getTrendingBooks = async (): Promise<Book[]> => {
  const res = await api.get('/books/trending')
  return res.data.data
}

export const getRecentBooks = async (): Promise<Book[]> => {
  const res = await api.get('/books/recent')
  return res.data.data
}

export const getBookById = async (id: string): Promise<Book> => {
  const res = await api.get(`/books/${id}`)
  return res.data.data
}

export const getGenres = async () => {
  const res = await api.get('/books/genres')
  return res.data.data
}

export const getBooks = async (page = 1, search?: string) => {
  const res = await api.get('/books', { params: { page, search } })
  return res.data
}