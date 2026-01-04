/**
 * API Service Layer
 *
 * This module handles all API communications with the backend.
 * Currently returns mock data - replace with real API calls when backend is ready.
 *
 * See docs/API_INTEGRATION.md for endpoint specifications.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000')
const USE_REAL_API = import.meta.env.VITE_ENABLE_REAL_SERVER_STATUS === 'true'

interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: FetchOptions = {}) {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
    throw new Error('Unknown error occurred')
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Server Status API
 */
export interface ServerStatus {
  name: string
  players: number
  maxPlayers: number
  queue: number
  map: string
  fps: number
  uptime: string
  lastWipe: string
  nextWipe: string
  online: boolean
}

export async function getServerStatus(): Promise<ServerStatus> {
  if (!USE_REAL_API) {
    // Use configured environment values
    const currentPlayers = parseInt(import.meta.env.VITE_CURRENT_PLAYERS || '0')
    const maxPlayers = parseInt(import.meta.env.VITE_SERVER_MAX_PLAYERS || '200')
    const currentQueue = parseInt(import.meta.env.VITE_CURRENT_QUEUE || '0')
    const serverFps = parseInt(import.meta.env.VITE_SERVER_FPS || '60')
    const serverUptime = import.meta.env.VITE_SERVER_UPTIME || '0d 0h 0m'
    const lastWipeDate = import.meta.env.VITE_LAST_WIPE_DATE || '2026-01-01T19:00:00Z'
    const nextWipeDate = import.meta.env.VITE_NEXT_WIPE_DATE || '2026-01-08T19:00:00Z'

    return {
      name: import.meta.env.VITE_SERVER_NAME || 'Art of Rust | Main Server',
      players: currentPlayers,
      maxPlayers: maxPlayers,
      queue: currentQueue,
      map: 'Procedural Map',
      fps: serverFps,
      uptime: serverUptime,
      lastWipe: lastWipeDate,
      nextWipe: nextWipeDate,
      online: currentPlayers > 0
    }
  }

  return fetchWithTimeout(`${API_URL}/server/status`)
}

/**
 * Wipe Schedule API
 */
export interface WipeEvent {
  id: string | number
  type: 'full' | 'map' | 'bp'
  date: string
  completed?: boolean
  mapSize?: number
  mapSeed?: string
  notes?: string
}

export interface WipeSchedule {
  next: WipeEvent | null
  upcoming: WipeEvent[]
  history: WipeEvent[]
}

export async function getWipeSchedule(): Promise<WipeSchedule> {
  if (!USE_REAL_API) {
    const nextWipeDate = import.meta.env.VITE_NEXT_WIPE_DATE || '2026-01-08T19:00:00Z'
    const nextWipeType = (import.meta.env.VITE_NEXT_WIPE_TYPE || 'full') as WipeEvent['type']
    const lastWipeDate = import.meta.env.VITE_LAST_WIPE_DATE || '2026-01-01T19:00:00Z'
    const mapSize = parseInt(import.meta.env.VITE_MAP_SIZE || '4000')

    return {
      next: {
        id: '1',
        type: nextWipeType,
        date: nextWipeDate,
        mapSize: mapSize,
        notes: nextWipeType === 'full'
          ? 'Monthly force wipe - Full wipe including blueprints'
          : 'Map wipe only - Blueprints preserved'
      },
      upcoming: [],
      history: [{
        id: 'h1',
        type: 'full',
        date: lastWipeDate,
        completed: true,
        mapSize: mapSize,
        mapSeed: '12345678',
        notes: 'Last server wipe'
      }]
    }
  }

  return fetchWithTimeout(`${API_URL}/wipes/schedule`)
}

/**
 * Leaderboards API
 */
export interface Player {
  steam_id?: string
  name: string
  rank: number
  kills: number
  deaths: number
  kd: number
  playtime: number
  headshots: number
  longest_kill?: number
}

export type LeaderboardCategory = 'kills' | 'kd' | 'playtime' | 'headshots'

export async function getLeaderboards(
  category: LeaderboardCategory = 'kills',
  limit: number = 100
): Promise<{ category: string; updated: string; players: Player[] }> {
  if (!USE_REAL_API) {
    // Return empty for now if leaderboards not enabled
    return {
      category,
      updated: new Date().toISOString(),
      players: []
    }
  }

  return fetchWithTimeout(`${API_URL}/leaderboards?category=${category}&limit=${limit}`)
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
