import { Request, Response } from 'express'
import { serverService } from '../services/server.service.js'
import { db } from '../models/database.js'

export const getServerStatus = async (req: Request, res: Response) => {
  try {
    const status = await serverService.getStatus()
    res.json(status)
  } catch (error) {
    console.error('Error getting server status:', error)
    res.status(500).json({ error: 'Failed to fetch server status' })
  }
}

export const getServerHistory = async (req: Request, res: Response) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24
    const stmt = db.prepare(`
      SELECT * FROM server_stats
      WHERE timestamp > datetime('now', '-${hours} hours')
      ORDER BY timestamp ASC
    `)
    const stats = stmt.all()
    res.json(stats)
  } catch (error) {
    console.error('Error getting server history:', error)
    res.status(500).json({ error: 'Failed to fetch server history' })
  }
}
