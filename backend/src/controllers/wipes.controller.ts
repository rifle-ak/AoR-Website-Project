import { Request, Response } from 'express'
import { db, Wipe } from '../models/database.js'

export const getWipeSchedule = async (req: Request, res: Response) => {
  try {
    const nextWipe = db.prepare(`
      SELECT * FROM wipes
      WHERE completed = 0 AND date > datetime('now')
      ORDER BY date ASC
      LIMIT 1
    `).get() as Wipe | undefined

    const upcomingWipes = db.prepare(`
      SELECT * FROM wipes
      WHERE completed = 0 AND date > datetime('now')
      ORDER BY date ASC
      LIMIT 5
    `).all() as Wipe[]

    const history = db.prepare(`
      SELECT * FROM wipes
      WHERE completed = 1
      ORDER BY date DESC
      LIMIT 10
    `).all() as Wipe[]

    res.json({
      next: nextWipe || null,
      upcoming: upcomingWipes,
      history
    })
  } catch (error) {
    console.error('Error getting wipe schedule:', error)
    res.status(500).json({ error: 'Failed to fetch wipe schedule' })
  }
}

export const createWipe = async (req: Request, res: Response) => {
  try {
    const { type, date, map_size, map_seed, notes } = req.body

    const stmt = db.prepare(`
      INSERT INTO wipes (type, date, map_size, map_seed, notes)
      VALUES (?, ?, ?, ?, ?)
    `)

    const result = stmt.run(type, date, map_size, map_seed, notes)

    res.json({
      id: result.lastInsertRowid,
      type,
      date,
      map_size,
      map_seed,
      notes,
      completed: false
    })
  } catch (error) {
    console.error('Error creating wipe:', error)
    res.status(500).json({ error: 'Failed to create wipe' })
  }
}

export const completeWipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    db.prepare('UPDATE wipes SET completed = 1 WHERE id = ?').run(id)

    res.json({ success: true })
  } catch (error) {
    console.error('Error completing wipe:', error)
    res.status(500).json({ error: 'Failed to complete wipe' })
  }
}
