import { Response } from 'express'
import { db } from '../models/database.js'
import { AuthRequest } from '../middleware/auth.js'

// Get all published news
export const getNews = (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const stmt = db.prepare(`
      SELECT n.*, u.display_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_steam_id = u.steam_id
      WHERE n.published = 1
      ORDER BY n.created_at DESC
      LIMIT ?
    `)
    const news = stmt.all(limit)
    res.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
}

// Get single news post
export const getNewsPost = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const post = db.prepare(`
      SELECT n.*, u.display_name as author_name, u.avatar_url as author_avatar
      FROM news n
      LEFT JOIN users u ON n.author_steam_id = u.steam_id
      WHERE n.id = ? AND n.published = 1
    `).get(id)

    if (!post) {
      return res.status(404).json({ error: 'News post not found' })
    }

    res.json(post)
  } catch (error) {
    console.error('Error fetching news post:', error)
    res.status(500).json({ error: 'Failed to fetch news post' })
  }
}

// Create news post (admin only)
export const createNews = (req: AuthRequest, res: Response) => {
  try {
    const { title, content, excerpt, published } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' })
    }

    const stmt = db.prepare(`
      INSERT INTO news (title, content, excerpt, author_steam_id, published)
      VALUES (?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      title,
      content,
      excerpt || content.substring(0, 150) + '...',
      req.user?.steamId,
      published ? 1 : 0
    )

    res.json({
      id: result.lastInsertRowid,
      title,
      content,
      excerpt,
      published: !!published
    })
  } catch (error) {
    console.error('Error creating news:', error)
    res.status(500).json({ error: 'Failed to create news post' })
  }
}

// Update news post (admin only)
export const updateNews = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { title, content, excerpt, published } = req.body

    db.prepare(`
      UPDATE news
      SET title = ?, content = ?, excerpt = ?, published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, content, excerpt, published ? 1 : 0, id)

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating news:', error)
    res.status(500).json({ error: 'Failed to update news post' })
  }
}

// Delete news post (admin only)
export const deleteNews = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM news WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting news:', error)
    res.status(500).json({ error: 'Failed to delete news post' })
  }
}
