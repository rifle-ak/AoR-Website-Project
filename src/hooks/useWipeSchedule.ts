import { useEffect, useState } from 'react'
import { getWipeSchedule, WipeSchedule } from '../services/api'

export function useWipeSchedule() {
  const [schedule, setSchedule] = useState<WipeSchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true)
        const data = await getWipeSchedule()
        setSchedule(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wipe schedule')
        console.error('Error fetching wipe schedule:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  return { schedule, loading, error }
}
