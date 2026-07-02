import api from './api'

export const toggleBookmark = async (bookId: string, chapterId: string) => {
  const res = await api.post(`/library/bookmarks/${bookId}`, { chapterId })
  return res.data.data
}

export const getBookmarkStatus = async (chapterId: string) => {
  const res = await api.get(`/library/bookmarks/chapter/${chapterId}`)
  return res.data.data
}

export const getUserBookmarks = async () => {
  const res = await api.get('/library/bookmarks')
  return res.data.data
}

export const updateProgress = async (
  bookId: string,
  chapterId: string,
  progress: number
) => {
  const res = await api.post(`/library/progress/${bookId}`, { chapterId, progress })
  return res.data.data
}

export const getContinueReading = async () => {
  const res = await api.get('/library/continue-reading')
  return res.data.data
}