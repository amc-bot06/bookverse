import { Request, Response } from 'express'
import { sendSuccess } from '../utils/apiResponse'

export const healthCheck = (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }, 'BookVerse API is running')
}