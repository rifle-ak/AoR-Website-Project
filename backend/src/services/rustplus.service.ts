import { RustPlus } from 'rustplus.js'
import { env } from '../config/env.js'

export interface ServerInfo {
  name: string
  players: number
  maxPlayers: number
  queue: number
  map: string
  mapSize: number
  mapSeed: number
  fps: number
  uptime: number
  online: boolean
  lastUpdate: Date
}

class RustPlusService {
  private rust: RustPlus | null = null
  private cachedInfo: ServerInfo | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 30000 // 30 seconds
  
  async connect(): Promise<void> {
    if (!env.ENABLE_RUST_PLUS) {
      console.log('ℹ️  Rust+ integration disabled')
      return
    }

    if (!env.RUST_PLUS_PORT || !env.RUST_PLAYER_TOKEN) {
      console.warn('⚠️  Rust+ credentials not configured')
      return
    }

    try {
      this.rust = new RustPlus(
        env.RUST_SERVER_IP,
        parseInt(env.RUST_PLUS_PORT),
        parseInt(env.RUST_PLAYER_TOKEN, 10),
        0 // Player ID (can be any number for server info)
      )

      await this.rust.connect()
      console.log('✅ Connected to Rust+ API')
    } catch (error) {
      console.error('❌ Failed to connect to Rust+:', error)
      this.rust = null
    }
  }

  async getServerInfo(): Promise<ServerInfo | null> {
    // Return cached data if still fresh
    if (this.cachedInfo && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.cachedInfo
    }

    if (!this.rust) {
      return null
    }

    try {
      const info = await this.rust.getInfo()
      const time = await this.rust.getTime()
      
      this.cachedInfo = {
        name: info.name,
        players: info.players,
        maxPlayers: info.max_players,
        queue: info.queued_players,
        map: info.map,
        mapSize: info.map_size,
        mapSeed: info.seed,
        fps: Math.round(1000 / info.framerate),
        uptime: time.time,
        online: true,
        lastUpdate: new Date()
      }
      
      this.lastFetch = Date.now()
      return this.cachedInfo
    } catch (error) {
      console.error('Error fetching Rust+ server info:', error)
      return null
    }
  }

  async disconnect(): Promise<void> {
    if (this.rust) {
      await this.rust.disconnect()
      this.rust = null
      console.log('Disconnected from Rust+ API')
    }
  }
}

export const rustPlusService = new RustPlusService()
