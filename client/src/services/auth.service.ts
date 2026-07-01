import api from './api'
import type { AuthUser } from '../types'

export const signup = async (data: {
  username: string
  email: string
  password: string
}): Promise<{ user: AuthUser; token: string }> => {
  const res = await api.post('/auth/signup', data)
  return res.data.data
}

export const login = async (data: {
  email: string
  password: string
}): Promise<{ user: AuthUser; token: string }> => {
  const res = await api.post('/auth/login', data)
  return res.data.data
}

export const getMe = async (): Promise<AuthUser> => {
  const res = await api.get('/auth/me')
  return res.data.data
}