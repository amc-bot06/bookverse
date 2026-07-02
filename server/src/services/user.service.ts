import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'

// ─── Get User Profile by Username ────────────────────────────────────────────
export const getUserProfile = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
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

  if (!user) throw new AppError('User not found', 404)
  return user
}

// ─── Get User's Published Books ───────────────────────────────────────────────
export const getUserBooks = async (username: string) => {
  return prisma.book.findMany({
    where: {
      author: { username },
      status: { not: 'DRAFT' },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, likes: true, comments: true } },
    },
  })
}

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (
  userId: string,
  data: { username?: string; bio?: string; avatar?: string }
) => {
  if (data.username) {
    const existing = await prisma.user.findUnique({ where: { username: data.username } })
    if (existing && existing.id !== userId) {
      throw new AppError('This username is already taken', 409)
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      createdAt: true,
    },
  })
}

// ─── Follow User ──────────────────────────────────────────────────────────────
export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new AppError('You cannot follow yourself', 400)
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  })

  if (existing) {
    // Already following — unfollow
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    })
    return { following: false }
  }

  // Not following — follow
  await prisma.follow.create({
    data: { followerId, followingId },
  })
  return { following: true }
}

// ─── Check if Following ───────────────────────────────────────────────────────
export const isFollowing = async (followerId: string, followingId: string) => {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  })
  return !!follow
}