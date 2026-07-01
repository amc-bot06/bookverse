import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

// In development, store the client on the global object
// so hot reloads don't create new connections every time
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Test the connection when this module is imported
prisma.$connect()
  .then(() => logger.info('Database connected'))
  .catch((err) => logger.error('Database connection failed', err))