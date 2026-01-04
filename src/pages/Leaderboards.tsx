import { useState, useEffect } from 'react'
import { Trophy, Skull, Clock, Target, TrendingUp, User, Search } from 'lucide-react'
import SEO from '../components/SEO'

interface Player {
  rank: number
  name: string
  kills: number
  deaths: number
  kd: number
  playtime: number
  headshots: number
  distance: number
}

type LeaderboardCategory = 'kills' | 'kd' | 'playtime' | 'headshots'

const Leaderboards = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('kills')
  const [searchQuery, setSearchQuery] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call to fetch player statistics
    // This could integrate with Rust+ API, Battlemetrics, or custom backend
    const fetchLeaderboards = async () => {
      setLoading(true)
      try {
        // Example: const response = await fetch(`/api/leaderboards?category=${category}`)
        // const data = await response.json()
        // setPlayers(data)

        // Mock data for demo
        const mockPlayers: Player[] = Array.from({ length: 50 }, (_, i) => ({
          rank: i + 1,
          name: `Player${i + 1}`,
          kills: Math.floor(Math.random() * 1000) + 100,
          deaths: Math.floor(Math.random() * 500) + 50,
          kd: 0,
          playtime: Math.floor(Math.random() * 500) + 10,
          headshots: Math.floor(Math.random() * 200) + 10,
          distance: Math.floor(Math.random() * 5000) + 500
        }))

        // Calculate K/D ratio
        mockPlayers.forEach(player => {
          player.kd = player.deaths > 0 ? parseFloat((player.kills / player.deaths).toFixed(2)) : player.kills
        })

        // Sort based on category
        mockPlayers.sort((a, b) => {
          switch (category) {
            case 'kills':
              return b.kills - a.kills
            case 'kd':
              return b.kd - a.kd
            case 'playtime':
              return b.playtime - a.playtime
            case 'headshots':
              return b.headshots - a.headshots
            default:
              return 0
          }
        })

        // Update ranks
        mockPlayers.forEach((player, index) => {
          player.rank = index + 1
        })

        setPlayers(mockPlayers)
      } catch (error) {
        console.error('Failed to fetch leaderboards:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboards()
  }, [category])

  const categories = [
    { id: 'kills' as LeaderboardCategory, label: 'Top Kills', icon: Skull },
    { id: 'kd' as LeaderboardCategory, label: 'Best K/D', icon: Target },
    { id: 'playtime' as LeaderboardCategory, label: 'Most Playtime', icon: Clock },
    { id: 'headshots' as LeaderboardCategory, label: 'Headshot Kings', icon: TrendingUp }
  ]

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500'
    if (rank === 2) return 'text-gray-400'
    if (rank === 3) return 'text-orange-600'
    return 'text-dark-400'
  }

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className={`w-5 h-5 ${getRankColor(rank)}`} />
    return <span className="text-dark-400 text-sm">#{rank}</span>
  }

  const formatPlaytime = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return `${days}d ${remainingHours}h`
    }
    return `${hours}h`
  }

  const getCategoryValue = (player: Player) => {
    switch (category) {
      case 'kills':
        return player.kills.toLocaleString()
      case 'kd':
        return player.kd.toFixed(2)
      case 'playtime':
        return formatPlaytime(player.playtime)
      case 'headshots':
        return player.headshots.toLocaleString()
      default:
        return '-'
    }
  }

  return (
    <>
      <SEO
        title="Leaderboards"
        description="Check out the top players on Art of Rust. View player statistics, rankings, and achievements."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-rust-500" />
            Leaderboards
          </h1>
          <p className="text-dark-300 text-lg">
            Compete with the best. Track your stats and climb the ranks.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                category === cat.id
                  ? 'bg-rust-500 text-white'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-900 border-b border-dark-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">
                      {categories.find(c => c.id === category)?.label}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">
                      K/D
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">
                      Playtime
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredPlayers.slice(0, 100).map((player) => (
                    <tr
                      key={player.rank}
                      className="hover:bg-dark-900 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRankIcon(player.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-dark-400" />
                          <span className="text-white font-medium">{player.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-rust-500 font-bold text-lg">
                          {getCategoryValue(player)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-dark-300">{player.kd.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-dark-300">{formatPlaytime(player.playtime)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPlayers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-400">No players found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white mt-1">{players.length}</p>
              </div>
              <User className="w-8 h-8 text-rust-500" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Total Kills</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {players.reduce((sum, p) => sum + p.kills, 0).toLocaleString()}
                </p>
              </div>
              <Skull className="w-8 h-8 text-rust-500" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Avg K/D</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {(players.reduce((sum, p) => sum + p.kd, 0) / players.length).toFixed(2)}
                </p>
              </div>
              <Target className="w-8 h-8 text-rust-500" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">Total Playtime</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatPlaytime(players.reduce((sum, p) => sum + p.playtime, 0))}
                </p>
              </div>
              <Clock className="w-8 h-8 text-rust-500" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Leaderboards
