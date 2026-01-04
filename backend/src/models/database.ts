import Database from 'better-sqlite3'
import { env } from '../config/env.js'
import fs from 'fs'
import path from 'path'

// Ensure data directory exists
const dataDir = path.dirname(env.DATABASE_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export const db = new Database(env.DATABASE_PATH)

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL')

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    steam_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    headshots INTEGER DEFAULT 0,
    playtime INTEGER DEFAULT 0,
    longest_kill REAL DEFAULT 0,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('full', 'map', 'bp')),
    date DATETIME NOT NULL,
    map_size INTEGER,
    map_seed TEXT,
    notes TEXT,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS server_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    players INTEGER,
    queue INTEGER,
    fps INTEGER,
    uptime INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_players_kills ON players(kills DESC);
  CREATE INDEX IF NOT EXISTS idx_players_kd ON players((CAST(kills AS REAL) / NULLIF(deaths, 0)) DESC);
  CREATE INDEX IF NOT EXISTS idx_players_playtime ON players(playtime DESC);
  CREATE INDEX IF NOT EXISTS idx_wipes_date ON wipes(date DESC);
`)

console.log('✅ Database initialized')

export interface Player {
  steam_id: string
  name: string
  kills: number
  deaths: number
  headshots: number
  playtime: number
  longest_kill: number
  last_seen: string
  created_at: string
}

export interface Wipe {
  id: number
  type: 'full' | 'map' | 'bp'
  date: string
  map_size?: number
  map_seed?: string
  notes?: string
  completed: boolean
  created_at: string
}

export interface ServerStat {
  id: number
  timestamp: string
  players: number
  queue: number
  fps: number
  uptime: number
}
