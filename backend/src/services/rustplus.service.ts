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

// Stub service - Rust+ integration is optional and requires the rustplus.js package
// To enable: npm install @liamcottle/rustplus.js and update this file
class RustPlusService {
  private cachedInfo: ServerInfo | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 30000 // 30 seconds

  async connect(): Promise<void> {
    if (!env.ENABLE_RUST_PLUS) {
      console.log('ℹ️  Rust+ integration disabled (set ENABLE_RUST_PLUS=true to enable)')
      return
    }

    console.warn('⚠️  Rust+ integration not available - install @liamcottle/rustplus.js to enable')
    console.warn('    Run: npm install @liamcottle/rustplus.js')
  }

  async getServerInfo(): Promise<ServerInfo | null> {
    // Rust+ is not available without the package
    return null
  }

  async disconnect(): Promise<void> {
    // No-op when Rust+ is not available
  }
}

export const rustPlusService = new RustPlusService()
