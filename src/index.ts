import cors from 'cors'
import express from 'express'
import api from './api'
import { config } from './config'
import { initializeDb } from './sync'

// Initialize database on startup
initializeDb().catch(console.error)

const app = express()
const port = config().PORT || 3000

// API Key middleware for internal access security
const apiKeyMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '')
  const expectedApiKey = config().API_KEY

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Valid API key required for internal access' 
    })
  }

  next()
}

app.use(express.json())
app.use(cors())

// Apply API key middleware to all routes
app.use(apiKeyMiddleware)

app.use(api)

app.listen(port, () => {
  console.log(`Api running at http://localhost:${port}`)
  console.log('API secured with internal access key')
})
