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
    return {
      name: 'Art of Rust | Main Server',
      players: Math.floor(Math.random() * 150) + 50,
      maxPlayers: 200,
      queue: Math.floor(Math.random() * 10),
      map: 'Procedural Map',
      fps: Math.floor(Math.random() * 10) + 55,
      uptime: '5d 12h 34m',
      lastWipe: '2026-01-01T19:00:00Z',
      nextWipe: '2026-01-08T19:00:00Z',
      online: true
    }
  }

  return fetchWithTimeout(`${API_URL}/server/status`)
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
