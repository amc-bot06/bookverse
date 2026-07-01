import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

// Custom error class so we can attach a status code to any error
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// This middleware catches ALL errors thrown anywhere in the app
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err.message)

  // Our own AppError — use its status code
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  // Unknown error — always return 500
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
}

// Catches requests to routes that don't exist
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  })
}