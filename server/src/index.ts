import app from './app'
import { env } from './config/env'
import { logger } from './utils/logger'
import './config/database'

app.listen(env.port, () => {
  logger.info(`BookVerse API running on http://localhost:${env.port}`)
  logger.info(`Environment: ${env.nodeEnv}`)
})