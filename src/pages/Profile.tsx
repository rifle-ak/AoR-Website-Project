import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Trophy, Target, Crosshair, Clock, TrendingUp } from 'lucide-react'
import SEO from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

interface PlayerStats {
  steam_id: string
  name: string
  kills: number
  deaths: number
  headshots: number
  playtime: number
  longest_kill: number
  last_seen: string
}

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    async function fetchPlayerStats() {
      if (!user?.steamId) return

      try {
        const response = await fetch(`${API_URL}/players/${user.steamId}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching player stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPlayerStats()
    }
  }, [user, API_URL])

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
      </div>
    )
  }

  const kdr = stats && stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats?.kills.toString() || '0.00'
  const headshotPercentage = stats && stats.kills > 0 ? ((stats.headshots / stats.kills) * 100).toFixed(1) : '0.0'

  const statCards = [
    {
      icon: Target,
      label: 'Kills',
      value: stats?.kills || 0,
      color: 'text-green-500'
    },
    {
      icon: Crosshair,
      label: 'Deaths',
      value: stats?.deaths || 0,
      color: 'text-red-500'
    },
    {
      icon: Trophy,
      label: 'K/D Ratio',
      value: kdr,
      color: 'text-rust-500'
    },
    {
      icon: Crosshair,
      label: 'Headshots',
      value: stats?.headshots || 0,
      color: 'text-yellow-500'
    },
    {
      icon: TrendingUp,
      label: 'HS %',
      value: `${headshotPercentage}%`,
      color: 'text-blue-500'
    },
    {
      icon: Clock,
      label: 'Playtime',
      value: `${stats?.playtime || 0}h`,
      color: 'text-purple-500'
    }
  ]

  return (
    <>
      <SEO
        title={`${user.displayName}'s Profile`}
        description={`View ${user.displayName}'s player statistics and profile on Art of Rust.`}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-center gap-6">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-24 h-24 rounded-full border-4 border-rust-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-rust-500/20 border-4 border-rust-500 flex items-center justify-center">
                <User className="w-12 h-12 text-rust-500" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.displayName}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-dark-400">Steam ID: {user.steamId}</span>
                {user.isAdmin && (
                  <span className="px-2 py-1 rounded bg-red-500/20 text-red-500 font-medium">
                    Admin
                  </span>
                )}
                {user.isVip && (
                  <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 font-medium">
                    VIP
                  </span>
                )}
              </div>
              {stats && (
                <p className="text-dark-300 text-sm mt-2">
                  Last seen: {new Date(stats.last_seen).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
          </div>
        ) : stats ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div>
                      <p className="text-dark-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">Additional Statistics</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 rounded bg-dark-800">
                  <span className="text-dark-300">Longest Kill</span>
                  <span className="text-white font-semibold">{stats.longest_kill}m</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-dark-800">
                  <span className="text-dark-300">Total Playtime</span>
                  <span className="text-white font-semibold">{stats.playtime} hours</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-dark-800">
                  <span className="text-dark-300">K/D Ratio</span>
                  <span className="text-white font-semibold">{kdr}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-dark-800">
                  <span className="text-dark-300">Headshot Accuracy</span>
                  <span className="text-white font-semibold">{headshotPercentage}%</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <User className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-300 mb-2">No Stats Available</h3>
            <p className="text-dark-400">
              Your stats will appear here once you've played on the server.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Profile
