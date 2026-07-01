import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { httpLogger } from './utils/logger'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import healthRoutes from './routes/healthRoutes'

const app = express()

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet())                          // Secure HTTP headers
app.use(cors({ origin: env.clientUrl }))   // Only allow requests from React app

// ─── Parsing Middleware ───────────────────────────────────────────────────────
app.use(express.json())                    // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }))

// ─── Logging ─────────────────────────────────────────────────────────────────
app.use(httpLogger)

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes)

// ─── Error Handling (must be LAST) ───────────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

export default app