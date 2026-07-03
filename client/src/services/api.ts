import axios from 'axios'
import { getGuestId } from '../utils/guestId'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Before every request — attach the JWT token if it exists, and a stable
// anonymous guest ID (used server-side to de-duplicate view counts for
// logged-out visitors).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-Guest-Id'] = getGuestId()
  return config
})

// If a request that carried a token comes back 401 (token expired/invalid) — log the user out.
// A 401 from a request that never had a token (e.g. a failed login/signup attempt) is just
// "wrong credentials" and should be left for the caller to display, not treated as a session expiry.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = !!error.config?.headers?.Authorization
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api