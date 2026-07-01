import bcrypt from 'bcryptjs'
import { prisma } from '../config/database'
import { signToken } from '../utils/jwt'
import { AppError } from '../middleware/errorHandler'
import { SignupInput, LoginInput } from '../utils/validators'

export const signup = async (input: SignupInput) => {
  const { username, email, password } = input

  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) {
    throw new AppError('An account with this email already exists', 409)
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } })
  if (existingUsername) {
    throw new AppError('This username is already taken', 409)
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { email, username, passwordHash },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      bio: true,
      createdAt: true,
    },
  })

  const token = signToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  })

  return { user, token }
}

export const login = async (input: LoginInput) => {
  const { email, password } = input

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      bio: true,
      passwordHash: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw new AppError('Invalid email or password', 401)
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401)
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  })

  const { passwordHash: _, ...userWithoutPassword } = user

  return { user: userWithoutPassword, token }
}

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          books: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  return user
}