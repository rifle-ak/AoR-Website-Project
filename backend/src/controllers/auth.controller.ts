import { Request, Response } from 'express'
import { generateToken, AuthRequest } from '../middleware/auth.js'

export const steamAuthCallback = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`)
  }

  const token = generateToken({
    steamId: req.user.steamId,
    displayName: req.user.displayName,
    isAdmin: req.user.isAdmin
  })

  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL}?token=${token}`)
}

export const getCurrentUser = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  res.json(req.user)
}

export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.json({ success: true })
  })
}
