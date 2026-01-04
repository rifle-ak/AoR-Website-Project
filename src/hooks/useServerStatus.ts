import { useEffect, useState } from 'react'
import { getServerStatus, ServerStatus } from '../services/api'

export function useServerStatus(interval: number = 30000) {
  const [status, setStatus] = useState<ServerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true)
        const data = await getServerStatus()
        setStatus(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch server status')
        console.error('Error fetching server status:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const intervalId = setInterval(fetchStatus, interval)

    return () => clearInterval(intervalId)
  }, [interval])

  return { status, loading, error }
}
