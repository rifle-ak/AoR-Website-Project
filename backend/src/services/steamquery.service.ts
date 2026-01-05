import Gamedig from 'gamedig'
import { env } from '../config/env.js'

export interface ServerStatus {
  name: string
  map: string
  players: number
  maxPlayers: number
  queue: number
  online: boolean
  ping: number
  lastUpdate: Date
}

class SteamQueryService {
  private cachedStatus: ServerStatus | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 30000 // 30 seconds

  async getServerStatus(): Promise<ServerStatus | null> {
    // Return cached data if still fresh
    if (this.cachedStatus && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.cachedStatus
    }

    try {
      const state = await Gamedig.query({
        type: 'rust',
        host: env.RUST_SERVER_IP,
        port: parseInt(env.RUST_SERVER_PORT)
      })

      this.cachedStatus = {
        name: state.name,
        map: state.map || 'Unknown',
        players: state.players.length,
        maxPlayers: state.maxplayers,
        queue: state.raw?.queue || 0,
        online: true,
        ping: state.ping,
        lastUpdate: new Date()
      }

      this.lastFetch = Date.now()
      console.log(`✅ Server query successful: ${state.players.length}/${state.maxplayers} players`)

      return this.cachedStatus
    } catch (error) {
      console.error('❌ Failed to query server:', error)

      // Return offline status
      return {
        name: env.RUST_SERVER_IP,
        map: 'Unknown',
        players: 0,
        maxPlayers: 0,
        queue: 0,
        online: false,
        ping: 0,
        lastUpdate: new Date()
      }
    }
  }
}

export const steamQueryService = new SteamQueryService()
