import { config as dotenvConfig } from 'dotenv'

let configed = false

export const config = () => {
  if (configed) {
    return process.env
  }

  dotenvConfig()

  if (!process.env.HELIUS_API_KEY) {
    throw new Error('Helius key not specified')
  }

  if (!process.env.SOLANA_RPC_ENDPOINT) {
    throw new Error('RPC not specified')
  }

  if (!process.env.API_KEY) {
    throw new Error('API key not specified for internal access')
  }

  configed = true
  return process.env
}
