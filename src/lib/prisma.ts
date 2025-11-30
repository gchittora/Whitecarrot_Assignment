// Prisma Client Singleton
// This ensures we only create ONE instance of Prisma Client
// Important for development (hot reload) and production

import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

// Validate environment variable
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
}

// Declare global type for TypeScript
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create Neon adapter
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })

// Create Prisma Client instance
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: ['query', 'error', 'warn'], // Log queries in development
    })

// In development, save to global to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Export for use in other files
export default prisma
