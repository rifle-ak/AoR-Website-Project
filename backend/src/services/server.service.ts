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
    // Try Rust+ first if enabled
    if (env.ENABLE_RUST_PLUS) {
      const rustInfo = await rustPlusService.getServerInfo()
      if (rustInfo) {
        return rustInfo
      }
    }

    // Fallback to manual/configured stats
    return {
      name: process.env.VITE_SERVER_NAME || 'Art of Rust | Main Server',
      players: this.manualStats.players,
      maxPlayers: parseInt(env.RUST_SERVER_PORT) || 200,
      queue: this.manualStats.queue,
      map: 'Procedural Map',
      mapSize: 4000,
      mapSeed: 0,
      fps: this.manualStats.fps,
      uptime: this.manualStats.uptime,
      online: true,
      lastUpdate: new Date()
    }
  }

  updateManualStats(stats: Partial<typeof this.manualStats>) {
    this.manualStats = { ...this.manualStats, ...stats }
  }
}

export const serverService = new ServerService()
