import api from './api'

export const getLikeStatus = async (bookId: string) => {
  const res = await api.get(`/books/${bookId}/like`)
  return res.data.data
}

export const toggleLike = async (bookId: string) => {
  const res = await api.post(`/books/${bookId}/like`)
  return res.data.data
}

export const getComments = async (bookId: string) => {
  const res = await api.get(`/books/${bookId}/comments`)
  return res.data.data
}

export const addComment = async (bookId: string, content: string) => {
  const res = await api.post(`/books/${bookId}/comments`, { content })
  return res.data.data
}

export const updateComment = async (bookId: string, commentId: string, content: string) => {
  const res = await api.patch(`/books/${bookId}/comments/${commentId}`, { content })
  return res.data.data
}

export const deleteComment = async (bookId: string, commentId: string) => {
  const res = await api.delete(`/books/${bookId}/comments/${commentId}`)
  return res.data
}