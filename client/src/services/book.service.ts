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

export const getBooks = async (params: {
  page?: number
  search?: string
  genre?: string
  status?: string
  sort?: string
}) => {
  const res = await api.get('/books', { params })
  return res.data
}

export const getBookChapters = async (bookId: string) => {
  const res = await api.get(`/books/${bookId}/chapters`)
  return res.data.data
}

export const getChapter = async (bookId: string, chapterId: string) => {
  const res = await api.get(`/books/${bookId}/chapters/${chapterId}`)
  return res.data.data
}

export const createChapter = async (bookId: string, data: {
  title: string
  content: string
  chapterNumber: number
  published: boolean
}) => {
  const res = await api.post(`/books/${bookId}/chapters`, data)
  return res.data.data
}

export const updateChapter = async (bookId: string, chapterId: string, data: object) => {
  const res = await api.patch(`/books/${bookId}/chapters/${chapterId}`, data)
  return res.data.data
}

export const togglePublishChapter = async (bookId: string, chapterId: string) => {
  const res = await api.patch(`/books/${bookId}/chapters/${chapterId}/publish`)
  return res.data.data
}