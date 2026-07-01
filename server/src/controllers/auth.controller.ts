import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'
import { sendSuccess } from '../utils/apiResponse'

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.signup(req.body)
    sendSuccess(res, result, 'Account created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body)
    sendSuccess(res, result, 'Logged in successfully')
  } catch (error) {
    next(error)
  }
}

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getMe(req.user!.userId)
    sendSuccess(res, user)
  } catch (error) {
    next(error)
  }
}