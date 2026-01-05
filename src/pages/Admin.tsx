import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Newspaper, Calendar, Database, Shield, TrendingUp } from 'lucide-react'
import SEO from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

interface DashboardStats {
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
  }>
}

const Admin = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      navigate('/')
    }
  }, [isAuthenticated, authLoading, user, navigate])

  useEffect(() => {
    async function fetchDashboard() {
      if (!user?.isAdmin) return

      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.isAdmin) {
      fetchDashboard()
    }
  }, [user, API_URL])

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
      </div>
    )
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Players',
      value: dashboardData?.stats.totalPlayers || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Database,
      label: 'Registered Users',
      value: dashboardData?.stats.totalUsers || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Newspaper,
      label: 'News Posts',
      value: dashboardData?.stats.totalNews || 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: Calendar,
      label: 'Total Wipes',
      value: dashboardData?.stats.totalWipes || 0,
      color: 'text-rust-500',
      bgColor: 'bg-rust-500/20'
    }
  ]

  return (
    <>
      <SEO
        title="Admin Dashboard"
        description="Art of Rust server administration dashboard"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="w-10 h-10 text-rust-500" />
            Admin Dashboard
          </h1>
          <p className="text-dark-300 text-lg">
            Manage your Art of Rust server, users, and content.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-dark-600" />
                  </div>
                  <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Players */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-rust-500" />
                Recent Players
              </h2>
              {dashboardData?.recentPlayers && dashboardData.recentPlayers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-700">
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Player</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Kills</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Deaths</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">K/D</th>
                        <th className="text-left py-3 px-4 text-dark-400 font-medium">Playtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentPlayers.map((player, index) => (
                        <tr key={index} className="border-b border-dark-800 hover:bg-dark-800/50">
                          <td className="py-3 px-4 text-white font-medium">{player.name}</td>
                          <td className="py-3 px-4 text-green-500">{player.kills}</td>
                          <td className="py-3 px-4 text-red-500">{player.deaths}</td>
                          <td className="py-3 px-4 text-rust-500">
                            {player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills}
                          </td>
                          <td className="py-3 px-4 text-dark-300">{player.playtime}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-dark-400 text-center py-8">No recent player activity</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => navigate('/admin/news')}
                className="card hover:border-rust-500/50 transition-colors cursor-pointer"
              >
                <Newspaper className="w-8 h-8 text-rust-500 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Manage News</h3>
                <p className="text-dark-400 text-sm mb-4">
                  Create, edit, and publish server announcements and news posts.
                </p>
                <button className="btn-primary w-full text-sm">
                  Open News Manager
                </button>
              </div>

              <div
                onClick={() => navigate('/admin/users')}
                className="card hover:border-rust-500/50 transition-colors cursor-pointer"
              >
                <Users className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Manage Users</h3>
                <p className="text-dark-400 text-sm mb-4">
                  View and manage user accounts, roles, and permissions.
                </p>
                <button className="btn-primary w-full text-sm">
                  Open User Manager
                </button>
              </div>

              <div
                onClick={() => navigate('/admin/wipes')}
                className="card hover:border-rust-500/50 transition-colors cursor-pointer"
              >
                <Calendar className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Wipe Schedule</h3>
                <p className="text-dark-400 text-sm mb-4">
                  Manage server wipe schedule and configuration.
                </p>
                <button className="btn-primary w-full text-sm">
                  Manage Wipes
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Admin
