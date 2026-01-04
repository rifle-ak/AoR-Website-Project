import { useEffect, useState } from 'react'
import { getLeaderboards, Player, LeaderboardCategory } from '../services/api'

export function useLeaderboards(category: LeaderboardCategory = 'kills', limit: number = 100) {
  const [data, setData] = useState<{ category: string; updated: string; players: Player[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboards() {
      try {
        setLoading(true)
        const result = await getLeaderboards(category, limit)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboards')
        console.error('Error fetching leaderboards:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboards()
  }, [category, limit])

  return { data, loading, error }
}
