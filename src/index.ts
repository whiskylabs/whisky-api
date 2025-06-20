import cors from 'cors'
import express from 'express'
import api from './api'
import { config } from './config'
import { initializeDb } from './sync'

// Initialize database on startup
initializeDb().catch(console.error)

const app = express()
const port = config().PORT || 3000

app.use(express.json())
app.use(cors())

app.use(api)

app.listen(port, () => {
  console.log(`Api running at http://localhost:${port}`)
})
