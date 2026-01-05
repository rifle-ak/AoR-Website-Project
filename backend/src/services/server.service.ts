import { steamQueryService } from './steamquery.service.js'
import { rustPlusService, ServerInfo } from './rustplus.service.js'
import { env } from '../config/env.js'

class ServerService {
  private manualStats = {
    players: 0,
    queue: 0,
    fps: 60,
    uptime: 0
  }

  async getStatus(): Promise<ServerInfo> {
    // Try Steam Query first (most reliable and no setup needed)
    try {
      const steamStatus = await steamQueryService.getServerStatus()
      if (steamStatus && steamStatus.online) {
        return {
          name: steamStatus.name,
          players: steamStatus.players,
          maxPlayers: steamStatus.maxPlayers,
          queue: steamStatus.queue,
          map: steamStatus.map,
          mapSize: 4000, // Steam Query doesn't provide this
          mapSeed: 0,    // Steam Query doesn't provide this
          fps: 60,       // Steam Query doesn't provide this
          uptime: 0,     // Steam Query doesn't provide this
          online: true,
          lastUpdate: steamStatus.lastUpdate
        }
      }
    } catch (error) {
      console.error('Steam Query failed, trying Rust+:', error)
    }

    // Try Rust+ as fallback if enabled
    if (env.ENABLE_RUST_PLUS) {
      const rustInfo = await rustPlusService.getServerInfo()
      if (rustInfo) {
        return rustInfo
      }
    }

    // Final fallback to manual/configured stats
    return {
      name: process.env.VITE_SERVER_NAME || 'Art of Rust | Main Server',
      players: this.manualStats.players,
      maxPlayers: 200,
      queue: this.manualStats.queue,
      map: 'Procedural Map',
      mapSize: 4000,
      mapSeed: 0,
      fps: this.manualStats.fps,
      uptime: this.manualStats.uptime,
      online: false,
      lastUpdate: new Date()
    }
  }

  updateManualStats(stats: Partial<typeof this.manualStats>) {
    this.manualStats = { ...this.manualStats, ...stats }
  }
}

export const serverService = new ServerService()
