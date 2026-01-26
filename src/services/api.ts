/**
 * API Service Layer
 *
 * This module handles all API communications with the PHP backend.
 * The API runs on the same domain under /api
 */

// API URL - defaults to same origin /api for cPanel deployment
const API_URL = import.meta.env.VITE_API_URL || '/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000')

interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Get authorization header if user is logged in
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

/**
 * Fetch with timeout and auth
 */
async function fetchWithTimeout(url: string, options: FetchOptions = {}) {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...fetchOptions.headers
      },
      signal: controller.signal
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw new ApiError(error.message)
    }
    throw new ApiError('Unknown error occurred')
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// =============================================================================
// SERVER STATUS API
// =============================================================================

export interface ServerStatus {
  name: string
  players: number
  maxPlayers: number
  queue: number
  map: string
  fps: number
  uptime: string
  lastWipe: string | null
  nextWipe: string | null
  online: boolean
}

export async function getServerStatus(): Promise<ServerStatus> {
  return fetchWithTimeout(`${API_URL}/server/status`)
}

export interface ServerStat {
  id: number
  timestamp: string
  players: number
  queue: number
  fps: number
  uptime: number
}

export async function getServerHistory(hours: number = 24): Promise<ServerStat[]> {
  return fetchWithTimeout(`${API_URL}/server/history?hours=${hours}`)
}

// =============================================================================
// WIPE SCHEDULE API
// =============================================================================

export interface WipeEvent {
  id: number | string
  type: 'full' | 'map' | 'bp'
  date: string
  completed?: boolean
  mapSize?: number | null
  mapSeed?: string | null
  notes?: string | null
}

export interface WipeSchedule {
  next: WipeEvent | null
  upcoming: WipeEvent[]
  history: WipeEvent[]
}

export async function getWipeSchedule(): Promise<WipeSchedule> {
  return fetchWithTimeout(`${API_URL}/wipes/schedule`)
}

export async function createWipe(wipe: Omit<WipeEvent, 'id' | 'completed'>): Promise<WipeEvent> {
  return fetchWithTimeout(`${API_URL}/wipes`, {
    method: 'POST',
    body: JSON.stringify(wipe)
  })
}

export async function completeWipe(id: number): Promise<void> {
  return fetchWithTimeout(`${API_URL}/wipes/${id}/complete`, {
    method: 'POST'
  })
}

// =============================================================================
// LEADERBOARDS API
// =============================================================================

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

export interface LeaderboardResponse {
  category: string
  updated: string
  players: Player[]
}

export async function getLeaderboards(
  category: LeaderboardCategory = 'kills',
  limit: number = 100
): Promise<LeaderboardResponse> {
  return fetchWithTimeout(`${API_URL}/leaderboards?category=${category}&limit=${limit}`)
}

export async function getPlayerStats(steamId: string): Promise<Player> {
  return fetchWithTimeout(`${API_URL}/players/${steamId}`)
}

// =============================================================================
// NEWS API
// =============================================================================

export interface NewsPost {
  id: number
  title: string
  content: string
  excerpt?: string
  author_name: string
  author_avatar?: string
  published: boolean
  created_at: string
  updated_at: string
}

export async function getNews(limit: number = 10): Promise<NewsPost[]> {
  return fetchWithTimeout(`${API_URL}/news?limit=${limit}`)
}

export async function getNewsPost(id: number): Promise<NewsPost> {
  return fetchWithTimeout(`${API_URL}/news/${id}`)
}

export async function createNews(news: {
  title: string
  content: string
  excerpt?: string
  published?: boolean
}): Promise<NewsPost> {
  return fetchWithTimeout(`${API_URL}/news`, {
    method: 'POST',
    body: JSON.stringify(news)
  })
}

export async function updateNews(
  id: number,
  news: Partial<{ title: string; content: string; excerpt: string; published: boolean }>
): Promise<void> {
  return fetchWithTimeout(`${API_URL}/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(news)
  })
}

export async function deleteNews(id: number): Promise<void> {
  return fetchWithTimeout(`${API_URL}/news/${id}`, {
    method: 'DELETE'
  })
}

// =============================================================================
// AUTH API
// =============================================================================

export interface User {
  id: string
  steamId: string
  displayName: string
  avatarUrl?: string
  isAdmin: boolean
  isVip: boolean
  createdAt?: string
  lastLogin?: string
}

export function getLoginUrl(): string {
  return `${API_URL}/auth/steam`
}

export async function getCurrentUser(): Promise<User> {
  return fetchWithTimeout(`${API_URL}/auth/me`)
}

export async function logout(): Promise<void> {
  return fetchWithTimeout(`${API_URL}/auth/logout`, {
    method: 'POST'
  })
}

// =============================================================================
// ADMIN API
// =============================================================================

export interface DashboardStats {
  stats: {
    totalPlayers: number
    totalNews: number
    totalWipes: number
    totalUsers: number
  }
  recentPlayers: Array<{
    name: string
    kills: number
    deaths: number
    playtime: number
    last_seen: string
  }>
  recentStats?: ServerStat[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchWithTimeout(`${API_URL}/admin/dashboard`)
}

export interface AdminUser {
  steam_id: string
  display_name: string
  avatar_url?: string
  is_admin: boolean
  is_vip: boolean
  created_at: string
  last_login: string
}

export async function getUsers(): Promise<AdminUser[]> {
  return fetchWithTimeout(`${API_URL}/admin/users`)
}

export async function updateUserPrivileges(
  steamId: string,
  privileges: { isAdmin?: boolean; isVip?: boolean }
): Promise<void> {
  return fetchWithTimeout(`${API_URL}/admin/users/${steamId}`, {
    method: 'PUT',
    body: JSON.stringify(privileges)
  })
}

export async function updatePlayerStats(stats: {
  steamId: string
  name?: string
  kills?: number
  deaths?: number
  headshots?: number
  playtime?: number
}): Promise<void> {
  return fetchWithTimeout(`${API_URL}/admin/players/stats`, {
    method: 'POST',
    body: JSON.stringify(stats)
  })
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  return fetchWithTimeout(`${API_URL}/health`)
}
