import passport from 'passport'
import { Strategy as SteamStrategy } from 'passport-steam'
import { db } from '../models/database.js'
import { env } from '../config/env.js'

const STEAM_API_KEY = process.env.STEAM_API_KEY || ''
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3001/api/auth/steam/callback'

passport.serializeUser((user: any, done) => {
  done(null, user.steamId)
})

passport.deserializeUser((steamId: string, done) => {
  const user = db.prepare('SELECT * FROM users WHERE steam_id = ?').get(steamId)
  done(null, user)
})

if (STEAM_API_KEY) {
  passport.use(
    new SteamStrategy(
      {
        returnURL: CALLBACK_URL,
        realm: CALLBACK_URL.split('/api')[0],
        apiKey: STEAM_API_KEY
      },
      (identifier: string, profile: any, done: any) => {
        const steamId = identifier.split('/').pop()

        // Get or create user
        let user = db.prepare('SELECT * FROM users WHERE steam_id = ?').get(steamId)

        if (!user) {
          const stmt = db.prepare(`
            INSERT INTO users (steam_id, display_name, avatar_url)
            VALUES (?, ?, ?)
          `)
          stmt.run(steamId, profile.displayName, profile.photos?.[2]?.value || '')
          user = db.prepare('SELECT * FROM users WHERE steam_id = ?').get(steamId)
        } else {
          // Update profile info
          db.prepare(`
            UPDATE users
            SET display_name = ?, avatar_url = ?, last_login = CURRENT_TIMESTAMP
            WHERE steam_id = ?
          `).run(profile.displayName, profile.photos?.[2]?.value || '', steamId)
        }

        return done(null, user)
      }
    )
  )
}

export default passport
