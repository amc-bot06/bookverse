import api from './api'

export const getUserProfile = async (username: string) => {
  const res = await api.get(`/users/${username}`)
  return res.data.data
}

export const getUserBooks = async (username: string) => {
  const res = await api.get(`/users/${username}/books`)
  return res.data.data
}

export const updateProfile = async (data: { bio?: string; avatar?: string }) => {
  const res = await api.patch('/users/me', data)
  return res.data.data
}

export const followUser = async (username: string) => {
  const res = await api.post(`/users/${username}/follow`)
  return res.data.data
}

export const getFollowStatus = async (username: string) => {
  const res = await api.get(`/users/${username}/following`)
  return res.data.data
}