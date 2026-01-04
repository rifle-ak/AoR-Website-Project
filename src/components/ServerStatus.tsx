import { useEffect, useState } from 'react'
import { Users, Clock, Server, Zap, Map, Calendar } from 'lucide-react'

interface ServerInfo {
  name: string
  players: number
  maxPlayers: number
  queue: number
  map: string
  fps: number
  lastWipe: string
  nextWipe: string
  uptime: string
}

const ServerStatus = () => {
  // Get configuration from environment variables
  const serverName = import.meta.env.VITE_SERVER_NAME || 'Art of Rust | Main Server'
  const serverIp = import.meta.env.VITE_SERVER_IP || '188.64.33.62'
  const serverPort = import.meta.env.VITE_SERVER_PORT || '28017'
  const maxPlayers = parseInt(import.meta.env.VITE_SERVER_MAX_PLAYERS || '200')
  const nextWipeDate = import.meta.env.VITE_NEXT_WIPE_DATE || '2026-01-08T19:00:00Z'
  const lastWipeDate = import.meta.env.VITE_LAST_WIPE_DATE || '2026-01-01T19:00:00Z'

  // Optional manual stats (for when no API is available)
  const currentPlayers = parseInt(import.meta.env.VITE_CURRENT_PLAYERS || '0')
  const currentQueue = parseInt(import.meta.env.VITE_CURRENT_QUEUE || '0')
  const serverFps = parseInt(import.meta.env.VITE_SERVER_FPS || '60')
  const serverUptime = import.meta.env.VITE_SERVER_UPTIME || '0d 0h 0m'

  const [serverInfo, _setServerInfo] = useState<ServerInfo>({
    name: serverName,
    players: currentPlayers,
    maxPlayers: maxPlayers,
    queue: currentQueue,
    map: 'Procedural Map',
    fps: serverFps,
    lastWipe: lastWipeDate.split('T')[0],
    nextWipe: nextWipeDate,
    uptime: serverUptime
  })
  const [isOnline, setIsOnline] = useState(currentPlayers > 0)

  useEffect(() => {
    // TODO: Replace with actual API call to your Rust server
    // This could use Rust+ API, Battlemetrics API, or custom backend
    const fetchServerStatus = async () => {
      try {
        const useRealAPI = import.meta.env.VITE_ENABLE_REAL_SERVER_STATUS === 'true'

        if (useRealAPI) {
          // TODO: Make actual API call when backend is ready
          // const response = await fetch(import.meta.env.VITE_API_URL + '/server/status')
          // const data = await response.json()
          // setServerInfo(data)
          // setIsOnline(true)
          console.warn('VITE_ENABLE_REAL_SERVER_STATUS is true but no API configured yet')
          setIsOnline(false)
          return
        }

        // Demo mode - use manually configured stats from .env
        setIsOnline(currentPlayers > 0)
      } catch (error) {
        console.error('Failed to fetch server status:', error)
        setIsOnline(false)
      }
    }

    fetchServerStatus()
    const interval = setInterval(fetchServerStatus, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getPlayerPercentage = () => {
    return (serverInfo.players / serverInfo.maxPlayers) * 100
  }

  const getPlayerColor = () => {
    const percentage = getPlayerPercentage()
    if (percentage >= 90) return 'text-red-500'
    if (percentage >= 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getNextWipeCountdown = () => {
    const now = new Date()
    const wipeDate = new Date(serverInfo.nextWipe)
    const diff = wipeDate.getTime() - now.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${days}d ${hours}h`
  }

  return (
    <div className="space-y-4">
      {/* Server Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-rust-500" />
            {serverInfo.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-sm text-dark-300">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Player Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-dark-400" />
              <span className="text-dark-300">Players Online</span>
            </div>
            <span className={`text-lg font-bold ${getPlayerColor()}`}>
              {serverInfo.players} / {serverInfo.maxPlayers}
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                getPlayerPercentage() >= 90 ? 'bg-red-500' :
                getPlayerPercentage() >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${getPlayerPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Server Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-rust-500" />
              <span className="text-xs text-dark-400">Queue</span>
            </div>
            <p className="text-lg font-bold text-white">{serverInfo.queue}</p>
          </div>

          <div className="bg-dark-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-rust-500" />
              <span className="text-xs text-dark-400">FPS</span>
            </div>
            <p className="text-lg font-bold text-white">{serverInfo.fps}</p>
          </div>

          <div className="bg-dark-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4 text-rust-500" />
              <span className="text-xs text-dark-400">Map</span>
            </div>
            <p className="text-sm font-bold text-white truncate">{serverInfo.map}</p>
          </div>

          <div className="bg-dark-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-rust-500" />
              <span className="text-xs text-dark-400">Next Wipe</span>
            </div>
            <p className="text-sm font-bold text-white">{getNextWipeCountdown()}</p>
          </div>
        </div>

        {/* Server Info */}
        <div className="mt-4 pt-4 border-t border-dark-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Uptime: {serverInfo.uptime}</span>
            <span className="text-dark-400">Last Wipe: {new Date(serverInfo.lastWipe).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h4 className="font-semibold text-white mb-3">Quick Connect</h4>
        <div className="space-y-2">
          <button
            onClick={() => {
              // Copy to clipboard
              navigator.clipboard.writeText(`connect ${serverIp}:${serverPort}`)
            }}
            className="btn-primary w-full"
          >
            Copy Connect Command
          </button>
          <button
            onClick={() => {
              // Open Steam connect URL
              window.open(`steam://connect/${serverIp}:${serverPort}`, '_blank')
            }}
            className="btn-secondary w-full"
          >
            Connect via Steam
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServerStatus
