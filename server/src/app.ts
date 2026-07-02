import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { httpLogger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFound'
import healthRoutes from './routes/healthRoutes'
import authRoutes from './routes/auth.routes'
import bookRoutes from './routes/book.routes'
import chapterRoutes from './routes/chapter.routes'
import userRoutes from './routes/user.routes'
import interactionRoutes from './routes/interaction.routes'
import libraryRoutes from './routes/library.routes'

const app = express()

app.use(helmet())
app.use(cors({
  // In dev, Vite bumps to the next free port (5174, 5175...) whenever 5173 is
  // already taken, which otherwise silently breaks CORS. Allow the whole
  // Vite dev port range in development; stick to the configured origin in prod.
  origin: env.isDevelopment ? /^http:\/\/localhost:517\d$/ : env.clientUrl,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(httpLogger)

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/books/:bookId/chapters', chapterRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/books/:bookId', interactionRoutes)
app.use('/api/library', libraryRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app