import { WhiskyTransaction, PROGRAM_ID, parseWhiskyTransaction } from '@whisky-gaming/core'
import { all, db, get } from './db'
import { getPrices } from './price'
import { createBatches, getResultNumber } from './utils'
import { connection } from './web3'

interface SignatureObject {
  signature: string
  block_time: number
}

/**
 * Recursively fetch signatures until "earliest" is reached,
 * or until there are no more signatures to fetch
 */
const getSignatures = async (
  before?: SignatureObject,
  until?: SignatureObject,
  batch: SignatureObject[] = [],
): Promise<SignatureObject[]> => {
  console.log('Searching signatures before %d until %d Batch: (%d)', before?.block_time, until?.block_time, batch.length)
  const signatures = await connection.getSignaturesForAddress(
    PROGRAM_ID,
    {
      limit: 1000,
      before: before?.signature,
      until: until?.signature,
    },
    'confirmed',
  )

  if (!signatures.length) {
    return batch
  }

  const sigs = signatures
    .map((x) => ({ block_time: x.blockTime, signature: x.signature }))

  // console.log('Signaturses:', sigs.map((x) => x.signature + '-' + x.block_time))
  until && console.log('Until:', until.signature + '-' + until.block_time)
  const nextBatch = [...batch, ...sigs].sort((a, b) => a.block_time - b.block_time)

  const nextBefore = nextBatch[0]

  if (nextBefore === before) {
    return nextBatch
  }

  await new Promise((resolve) => setTimeout(resolve, 100))

  return await getSignatures(
    nextBefore,
    until,
    nextBatch,
  )
}

/**
 * Returns unpopulated signatures
 */
const getRemainingSignatures = async () => {
  const latestGame = await db.getLatestSettledGame()
  const latestPoolChange = await db.getLatestPoolChange()
  const latest = Math.max(
    latestGame?.blockTime || 0,
    latestPoolChange?.blockTime || 0
  )

  console.log('Latest blocktime', latest)

  const remaining = await db.getSignaturesAfterTime(latest)

  return remaining.map(sig => ({
    signature: sig.signature,
    block_time: sig.blockTime
  })) as SignatureObject[]
}

const storeEvents = async (events: (WhiskyTransaction<'GameSettled'> | WhiskyTransaction<'PoolChange'>)[]) => {
  const prices = await getPrices(events.map((x) => x.data.tokenMint.toString()))

  for (const event of events) {
    if (event.name === 'PoolChange') {
      await db.createPoolChange({
        signature: event.signature,
        blockTime: Math.floor(event.time / 1000),
        action: event.data.action.deposit ? 'deposit' : 'withdraw',
        token: event.data.tokenMint.toString(),
        pool: event.data.pool.toString(),
        user: event.data.user.toString(),
        amount: event.data.amount.toString(),
        lpSupply: event.data.lpSupply.toString(),
        postLiquidity: event.data.postLiquidity.toString(),
        usdPerUnit: prices[event.data.tokenMint.toString()].usdPerUnit,
      })
    }
    if (event.name === 'GameSettled') {
      await db.createSettledGame({
        signature: event.signature,
        blockTime: Math.floor(event.time / 1000),
        metadata: event.data.metadata,
        nonce: event.data.nonce.toString(),
        clientSeed: event.data.clientSeed,
        rngSeed: event.data.rngSeed,
        nextRngSeedHashed: event.data.nextRngSeedHashed,
        bet: JSON.stringify(event.data.bet),
        betLength: event.data.bet.length,
        resultNumber: await getResultNumber(event.data.rngSeed, event.data.clientSeed, event.data.nonce),
        creator: event.data.creator.toString(),
        user: event.data.user.toString(),
        token: event.data.tokenMint.toString(),
        pool: event.data.pool.toString(),
        wager: event.data.wager.toString(),
        payout: event.data.payout.toString(),
        multiplierBps: event.data.multiplierBps.toString(),
        creatorFee: event.data.creatorFee.toString(),
        poolFee: event.data.poolFee.toString(),
        whiskyFee: event.data.whiskyFee.toString(),
        jackpotFee: event.data.jackpotFee.toString(),
        jackpot: event.data.jackpotPayoutToUser.toString(),
        poolLiquidity: event.data.poolLiquidity.toString(),
        usdPerUnit: prices[event.data.tokenMint.toString()].usdPerUnit,
      })
    }
  }
}

const fetchAndStoreEventsFromSignatures = async (signatures: string[]) => {
  const signatureBatches = createBatches(signatures, 100)

  for (const batch of signatureBatches) {
    const attempt = async (attempts = 0): Promise<(WhiskyTransaction<'GameSettled'> | WhiskyTransaction<'PoolChange'>)[]> => {
      try {
        const transactions = (await connection.getParsedTransactions(
          batch,
          {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed',
          },
        )).flatMap((x) => x ? [x] : [])

        return transactions.flatMap(parseWhiskyTransaction)
      } catch {
        console.log('Retrying... %d', attempts)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
        return attempt(attempts + 1)
      }
    }

    const events = await attempt()

    events.length && console.log('Storing %d events', events.length)

    storeEvents(events)
  }
}

/**
 * Manual sync function - processes existing signatures and fetches new ones
 */
export const manualSync = async () => {
  try {
    console.log('🔄 Starting manual sync...')
    
    // Process existing unprocessed signatures
    const remainingSignatures = await getRemainingSignatures()
    console.log('📊 Processing %d remaining signatures', remainingSignatures.length)
    
    if (remainingSignatures.length > 0) {
      remainingSignatures.sort((a, b) => a.block_time - b.block_time)
      await fetchAndStoreEventsFromSignatures(remainingSignatures.map((x) => x.signature))
    }

    // Fetch new signatures from blockchain
    const lastStoredSignature = await get('SELECT signature, "blockTime" as block_time from signatures order by "blockTime" desc')
    const newSignatures = await getSignatures(undefined, lastStoredSignature)
    
    console.log('🔍 Found %d new signatures', newSignatures.length)

    if (newSignatures.length > 0) {
      // Store new signatures using Prisma
      for (const sig of newSignatures) {
        await db.createSignature(sig.signature, sig.block_time)
      }

      console.log('💾 Stored %d new signatures', newSignatures.length)
      
      // Process the newly stored signatures
      await fetchAndStoreEventsFromSignatures(newSignatures.map((x) => x.signature))
    }

    console.log('✅ Manual sync completed successfully')
    return {
      success: true,
      processedSignatures: remainingSignatures.length,
      newSignatures: newSignatures.length,
      totalProcessed: remainingSignatures.length + newSignatures.length
    }
    
  } catch (err) {
    console.error('❌ Manual sync error', err)
    throw err
  }
}

/**
 * Initialize database - called once on startup
 */
export const initializeDb = async () => {
  try {
    const { initializeDb: initDb } = await import('./db')
    await initDb()
    console.log('🗄️ Database initialized')
  } catch (err) {
    console.error('❌ Database initialization error', err)
    throw err
  }
}
