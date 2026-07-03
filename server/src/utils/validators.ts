import { z } from 'zod'

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[^\s@#/?&]+$/, 'Username cannot contain spaces, @, #, /, ?, or &')
    .regex(/\d/, 'Username must contain at least one number'),
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Helper type to extract the TypeScript type from a Zod schema
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be under 2000 characters'),
  genres: z
    .array(z.string())
    .min(1, 'Select at least one genre'),
  tags: z
    .array(z.string())
    .optional()
    .default([]),
  language: z
    .string()
    .optional()
    .default('English'),
  plannedChapters: z
    .number()
    .int()
    .positive('Planned chapters must be a positive number')
    .nullable()
    .optional(),
  coverImage: z
    .string()
    .optional()
    .nullable(),
})

export const updateBookSchema = createBookSchema.partial()

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>

export const createChapterSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters'),
  content: z
    .string()
    .min(1, 'Content is required'),
  chapterNumber: z
    .number()
    .int()
    .positive('Chapter number must be positive'),
  published: z
    .boolean()
    .optional()
    .default(false),
})

// Deliberately not createChapterSchema.partial() — `published` must never be
// settable through the general update endpoint. Its default(false) would
// silently reset an already-published chapter back to draft on every save,
// since editors never send `published` at all. Publishing is a one-way action
// exposed only via the dedicated togglePublish endpoint.
export const updateChapterSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters')
    .optional(),
  content: z
    .string()
    .min(1, 'Content is required')
    .optional(),
  chapterNumber: z
    .number()
    .int()
    .positive('Chapter number must be positive')
    .optional(),
})

export type CreateChapterInput = z.infer<typeof createChapterSchema>
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[^\s@#/?&]+$/, 'Username cannot contain spaces, @, #, /, ?, or &')
    .regex(/\d/, 'Username must contain at least one number')
    .optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>