import morgan from 'morgan'
import { Request, Response } from 'express'

// Custom log format: METHOD /path STATUS responseTime ms
export const httpLogger = morgan(
  ':method :url :status :response-time ms',
  {
    // Only log errors in production to reduce noise
    skip: (_req: Request, res: Response) => {
      if (process.env.NODE_ENV === 'production') {
        return res.statusCode < 400
      }
      return false
    },
  }
)

// Simple console logger for use inside controllers/services
export const logger = {
  info: (msg: string, ...args: unknown[]) =>
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) =>
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) =>
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, ...args),
}