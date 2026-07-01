import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { httpLogger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { notFoundHandler } from './middleware/notFound'
import healthRoutes from './routes/healthRoutes'
import authRoutes from './routes/auth.routes'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.clientUrl }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(httpLogger)

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app