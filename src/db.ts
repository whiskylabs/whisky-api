import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Initialize database connection
export const initializeDb = async () => {
  try {
    await prisma.$connect()
    console.log('🗄️ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Close database connection
export const closeDb = async () => {
  await prisma.$disconnect()
}

// Helper function to get all records
export const all = async (query: string, params?: any) => {
  // For complex queries, we'll use Prisma's queryRaw
  // For simple queries, we'll use Prisma's built-in methods
  try {
    const result = await prisma.$queryRawUnsafe(query, ...(params ? [params] : []))
    return result as any[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper function to get single record
export const get = async (query: string, params?: any) => {
  try {
    const result = await prisma.$queryRawUnsafe(query, ...(params ? [params] : []))
    const results = result as any[]
    return results[0] || null
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Prisma-specific helper functions for better type safety
export const db = {
  // Signature operations
  createSignature: async (signature: string, blockTime: number) => {
    return await prisma.signature.upsert({
      where: { signature },
      update: { blockTime },
      create: { signature, blockTime }
    })
  },

  // SettledGame operations
  createSettledGame: async (data: {
    signature: string
    blockTime: number
    metadata?: string
    nonce: string
    clientSeed: string
    rngSeed: string
    nextRngSeedHashed: string
    bet: string
    betLength: number
    resultNumber: number
    creator: string
    user: string
    token: string
    pool: string
    wager: string
    payout: string
    multiplierBps: string
    creatorFee: string
    poolFee: string
    whiskyFee: string
    jackpotFee: string
    jackpot: string
    poolLiquidity: string
    usdPerUnit: number
  }) => {
    return await prisma.settledGame.upsert({
      where: { signature: data.signature },
      update: data,
      create: data
    })
  },

  // PoolChange operations
  createPoolChange: async (data: {
    signature: string
    blockTime: number
    action: string
    token: string
    pool: string
    user: string
    amount: string
    lpSupply: string
    postLiquidity: string
    usdPerUnit: number
  }) => {
    return await prisma.poolChange.upsert({
      where: { signature: data.signature },
      update: data,
      create: data
    })
  },

  // Query helpers
  getLatestSettledGame: async () => {
    return await prisma.settledGame.findFirst({
      orderBy: { blockTime: 'desc' }
    })
  },

  getLatestPoolChange: async () => {
    return await prisma.poolChange.findFirst({
      orderBy: { blockTime: 'desc' }
    })
  },

  getSignaturesAfterTime: async (blockTime: number) => {
    return await prisma.signature.findMany({
      where: { blockTime: { gte: blockTime } },
      orderBy: { blockTime: 'asc' }
    })
  },

  getSignatureCount: async () => {
    return await prisma.signature.count()
  },

  getSettledGameCount: async () => {
    return await prisma.settledGame.count()
  },

  getPoolChangeCount: async () => {
    return await prisma.poolChange.count()
  }
}
