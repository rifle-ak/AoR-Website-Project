import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, Crown, Search } from 'lucide-react'
import SEO from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

interface User {
  steam_id: string
  display_name: string
  avatar_url: string
  is_admin: boolean
  is_vip: boolean
  created_at: string
  last_login: string
}

const AdminUsers = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      navigate('/admin')
    }
  }, [isAuthenticated, authLoading, user, navigate])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(
        users.filter(u =>
          u.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.steam_id.includes(searchTerm)
        )
      )
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateUserRole(steamId: string, isAdmin: boolean, isVip: boolean) {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_URL}/admin/users/${steamId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAdmin, isVip })
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  async function toggleAdmin(steamId: string, currentValue: boolean) {
    const targetUser = users.find(u => u.steam_id === steamId)
    if (!targetUser) return

    if (!currentValue) {
      if (!confirm(`Grant admin privileges to ${targetUser.display_name}?`)) return
    } else {
      if (!confirm(`Remove admin privileges from ${targetUser.display_name}?`)) return
    }

    await updateUserRole(steamId, !currentValue, targetUser.is_vip)
  }

  async function toggleVip(steamId: string, currentValue: boolean) {
    const targetUser = users.find(u => u.steam_id === steamId)
    if (!targetUser) return

    await updateUserRole(steamId, targetUser.is_admin, !currentValue)
  }

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
      </div>
    )
  }

  return (
    <>
      <SEO title="User Management" description="Manage users and permissions" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-rust-500" />
            User Management
          </h1>
          <p className="text-dark-300">Manage user accounts and permissions</p>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or Steam ID..."
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-dark-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-dark-400 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.is_admin).length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-dark-400 text-sm">VIP Members</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.is_vip).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-4 px-4 text-dark-400 font-medium">User</th>
                    <th className="text-left py-4 px-4 text-dark-400 font-medium">Steam ID</th>
                    <th className="text-left py-4 px-4 text-dark-400 font-medium">Joined</th>
                    <th className="text-left py-4 px-4 text-dark-400 font-medium">Last Login</th>
                    <th className="text-center py-4 px-4 text-dark-400 font-medium">Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.steam_id} className="border-b border-dark-800 hover:bg-dark-800/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.display_name}
                              className="w-10 h-10 rounded-full border-2 border-rust-500"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-rust-500/20 border-2 border-rust-500 flex items-center justify-center">
                              <Users className="w-5 h-5 text-rust-500" />
                            </div>
                          )}
                          <span className="text-white font-medium">{u.display_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-dark-300 font-mono text-sm">{u.steam_id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-dark-300 text-sm">
                          {new Date(u.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-dark-300 text-sm">
                          {new Date(u.last_login).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => toggleAdmin(u.steam_id, u.is_admin)}
                            disabled={u.steam_id === user?.steamId}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              u.is_admin
                                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                : 'bg-dark-700 text-dark-400 hover:bg-dark-600'
                            } ${u.steam_id === user?.steamId ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={u.steam_id === user?.steamId ? 'Cannot modify own admin status' : ''}
                          >
                            <Shield className="w-3 h-3 inline mr-1" />
                            Admin
                          </button>
                          <button
                            onClick={() => toggleVip(u.steam_id, u.is_vip)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              u.is_vip
                                ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                                : 'bg-dark-700 text-dark-400 hover:bg-dark-600'
                            }`}
                          >
                            <Crown className="w-3 h-3 inline mr-1" />
                            VIP
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-300 mb-2">No Users Found</h3>
            <p className="text-dark-400">
              {searchTerm ? 'Try a different search term.' : 'No users have registered yet.'}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminUsers
