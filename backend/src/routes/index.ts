import express from 'express'
import { getServerStatus, getServerHistory } from '../controllers/server.controller.js'
import { getWipeSchedule, createWipe, completeWipe } from '../controllers/wipes.controller.js'
import { getLeaderboards, getPlayerStats } from '../controllers/leaderboards.controller.js'

const router = express.Router()

// Server routes
router.get('/server/status', getServerStatus)
router.get('/server/history', getServerHistory)

// Wipe routes
router.get('/wipes/schedule', getWipeSchedule)
router.post('/wipes', createWipe)
router.post('/wipes/:id/complete', completeWipe)

// Leaderboard routes
router.get('/leaderboards', getLeaderboards)
router.get('/players/:steamId', getPlayerStats)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
