// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  _count?: {
    followers: number
    following: number
    books: number
  }
}

// ─── Book ────────────────────────────────────────────────────────────────────
export type BookStatus = 'ONGOING' | 'COMPLETED' | 'DRAFT'

export interface Book {
  id: string
  title: string
  description: string
  coverImage?: string
  status: BookStatus
  genres: string[]
  tags: string[]
  views: number
  createdAt: string
  updatedAt: string
  author: User
  _count?: {
    likes: number
    comments: number
    chapters: number
  }
}

// ─── Chapter ─────────────────────────────────────────────────────────────────
export interface Chapter {
  id: string
  title: string
  content: string
  chapterNumber: number
  published: boolean
  bookId: string
  createdAt: string
  updatedAt: string
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser extends User {
  token: string
}