import { Response } from 'express'
import { db } from '../models/database.js'
import { AuthRequest } from '../middleware/auth.js'

// Get dashboard stats
export const getDashboardStats = (req: AuthRequest, res: Response) => {
  try {
    const totalPlayers = db.prepare('SELECT COUNT(*) as count FROM players').get() as { count: number }
    const totalNews = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number }
    const totalWipes = db.prepare('SELECT COUNT(*) as count FROM wipes').get() as { count: number }
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }

    const recentPlayers = db.prepare(`
      SELECT name, kills, deaths, playtime
      FROM players
      ORDER BY last_seen DESC
      LIMIT 10
    `).all()

    res.json({
      stats: {
        totalPlayers: totalPlayers.count,
        totalNews: totalNews.count,
        totalWipes: totalWipes.count,
        totalUsers: totalUsers.count
      },
      recentPlayers
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
}

// Get all users (admin panel)
export const getUsers = (req: AuthRequest, res: Response) => {
  try {
    const users = db.prepare(`
      SELECT steam_id, display_name, avatar_url, is_admin, is_vip, created_at, last_login
      FROM users
      ORDER BY last_login DESC
    `).all()

    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// Update user privileges
export const updateUserPrivileges = (req: AuthRequest, res: Response) => {
  try {
    const { steamId } = req.params
    const { isAdmin, isVip } = req.body

    db.prepare(`
      UPDATE users
      SET is_admin = ?, is_vip = ?
      WHERE steam_id = ?
    `).run(isAdmin ? 1 : 0, isVip ? 1 : 0, steamId)

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating user privileges:', error)
    res.status(500).json({ error: 'Failed to update user privileges' })
  }
}

// Manual player stats update
export const updatePlayerStats = (req: AuthRequest, res: Response) => {
  try {
    const { steamId, kills, deaths, headshots, playtime } = req.body

    const existing = db.prepare('SELECT * FROM players WHERE steam_id = ?').get(steamId)

    if (existing) {
      db.prepare(`
        UPDATE players
        SET kills = ?, deaths = ?, headshots = ?, playtime = ?, last_seen = CURRENT_TIMESTAMP
        WHERE steam_id = ?
      `).run(kills, deaths, headshots, playtime, steamId)
    } else {
      db.prepare(`
        INSERT INTO players (steam_id, name, kills, deaths, headshots, playtime)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(steamId, req.body.name || 'Unknown', kills, deaths, headshots, playtime)
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating player stats:', error)
    res.status(500).json({ error: 'Failed to update player stats' })
  }
}
