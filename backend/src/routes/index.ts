import express from 'express'
import passport from '../config/passport.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { getServerStatus, getServerHistory } from '../controllers/server.controller.js'
import { getWipeSchedule, createWipe, completeWipe } from '../controllers/wipes.controller.js'
import { getLeaderboards, getPlayerStats } from '../controllers/leaderboards.controller.js'
import { steamAuthCallback, getCurrentUser, logout } from '../controllers/auth.controller.js'
import { getNews, getNewsPost, createNews, updateNews, deleteNews } from '../controllers/news.controller.js'
import { getDashboardStats, getUsers, updateUserPrivileges, updatePlayerStats } from '../controllers/admin.controller.js'

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

// Auth routes
router.get('/auth/steam', passport.authenticate('steam'))
router.get('/auth/steam/callback', passport.authenticate('steam', { failureRedirect: '/' }), steamAuthCallback)
router.get('/auth/me', authMiddleware, getCurrentUser)
router.post('/auth/logout', logout)

// News routes
router.get('/news', getNews)
router.get('/news/:id', getNewsPost)
router.post('/news', authMiddleware, adminMiddleware, createNews)
router.put('/news/:id', authMiddleware, adminMiddleware, updateNews)
router.delete('/news/:id', authMiddleware, adminMiddleware, deleteNews)

// Admin routes
router.get('/admin/dashboard', authMiddleware, adminMiddleware, getDashboardStats)
router.get('/admin/users', authMiddleware, adminMiddleware, getUsers)
router.put('/admin/users/:steamId', authMiddleware, adminMiddleware, updateUserPrivileges)
router.post('/admin/players/stats', authMiddleware, adminMiddleware, updatePlayerStats)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
