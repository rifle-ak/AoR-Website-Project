import { Request, Response } from 'express'
import { db, Player } from '../models/database.js'

export const getLeaderboards = async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || 'kills'
    const limit = parseInt(req.query.limit as string) || 100

    let orderBy: string
    switch (category) {
      case 'kills':
        orderBy = 'kills DESC'
        break
      case 'kd':
        orderBy = '(CAST(kills AS REAL) / NULLIF(deaths, 0)) DESC'
        break
      case 'playtime':
        orderBy = 'playtime DESC'
        break
      case 'headshots':
        orderBy = 'headshots DESC'
        break
      default:
        orderBy = 'kills DESC'
    }

    const stmt = db.prepare(`
      SELECT 
        steam_id,
        name,
        kills,
        deaths,
        ROUND(CAST(kills AS REAL) / NULLIF(deaths, 0), 2) as kd,
        headshots,
        playtime,
        longest_kill
      FROM players
      WHERE kills > 0 OR deaths > 0
      ORDER BY ${orderBy}
      LIMIT ?
    `)

    const players = stmt.all(limit) as Player[]

    res.json({
      category,
      updated: new Date().toISOString(),
      players: players.map((p, index) => ({
        ...p,
        rank: index + 1
      }))
    })
  } catch (error) {
    console.error('Error getting leaderboards:', error)
    res.status(500).json({ error: 'Failed to fetch leaderboards' })
  }
}

export const getPlayerStats = async (req: Request, res: Response) => {
  try {
    const { steamId } = req.params

    const player = db.prepare('SELECT * FROM players WHERE steam_id = ?').get(steamId) as Player | undefined

    if (!player) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.json(player)
  } catch (error) {
    console.error('Error getting player stats:', error)
    res.status(500).json({ error: 'Failed to fetch player stats' })
  }
}
