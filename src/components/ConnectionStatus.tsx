import { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function checkConnection() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${API_URL}/health`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  // Don't show anything if connected
  if (isConnected) return null

  // Don't show during initial check to avoid flash
  if (isChecking) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg border border-red-400 max-w-sm">
        <div className="flex items-start gap-3">
          <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm mb-1">Backend Not Connected</p>
            <p className="text-xs text-red-100 mb-2">
              The backend server is not running. Steam login and admin features won't work.
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer hover:text-red-100 font-medium">
                How to fix
              </summary>
              <ol className="mt-2 space-y-1 text-red-100 list-decimal list-inside">
                <li>Open a terminal in the project folder</li>
                <li>Run: <code className="bg-red-600/50 px-1 rounded">cd backend && npm start</code></li>
                <li>Wait for "Server: http://localhost:3001"</li>
                <li>Refresh this page</li>
              </ol>
              <p className="mt-2 text-red-100">
                See <code className="bg-red-600/50 px-1 rounded">QUICKSTART.md</code> for detailed setup
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus
