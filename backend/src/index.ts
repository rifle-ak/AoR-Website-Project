import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cron from 'node-cron'
import { env } from './config/env.js'
import { rustPlusService } from './services/rustplus.service.js'
import { serverService } from './services/server.service.js'
import { db } from './models/database.js'
import routes from './routes/index.js'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
  credentials: true
}))
app.use(express.json())
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Routes
app.use('/api', routes)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  })
})

// Scheduled tasks
// Record server stats every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const status = await serverService.getStatus()
    db.prepare(`
      INSERT INTO server_stats (players, queue, fps, uptime)
      VALUES (?, ?, ?, ?)
    `).run(status.players, status.queue, status.fps, status.uptime)

    console.log(`📊 Recorded server stats: ${status.players}/${status.maxPlayers} players`)
  } catch (error) {
    console.error('Error recording server stats:', error)
  }
})

// Cleanup old stats (keep 30 days)
cron.schedule('0 2 * * *', () => {
  const result = db.prepare(`
    DELETE FROM server_stats
    WHERE timestamp < datetime('now', '-30 days')
  `).run()

  console.log(`🧹 Cleaned up ${result.changes} old server stats`)
})

// Start server
const PORT = parseInt(env.PORT)

async function start() {
  try {
    // Connect to Rust+ if enabled
    if (env.ENABLE_RUST_PLUS) {
      await rustPlusService.connect()
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
🚀 Art of Rust Backend API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:${PORT}
🔧 Environment: ${env.NODE_ENV}
🎮 Rust+: ${env.ENABLE_RUST_PLUS ? '✅ Enabled' : '❌ Disabled'}
📊 Battlemetrics: ${env.ENABLE_BATTLEMETRICS ? '✅ Enabled' : '❌ Disabled'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await rustPlusService.disconnect()
  db.close()
  process.exit(0)
})

start()
