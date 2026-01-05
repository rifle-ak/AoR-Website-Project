import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Plus, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react'
import SEO from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

interface Wipe {
  id: number
  type: 'full' | 'map' | 'bp'
  date: string
  map_size: number
  map_seed: string
  notes: string
  completed: boolean
  created_at: string
}

const AdminWipes = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [wipes, setWipes] = useState<Wipe[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    type: 'full' as 'full' | 'map' | 'bp',
    date: '',
    map_size: 4500,
    map_seed: '',
    notes: ''
  })
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      navigate('/admin')
    }
  }, [isAuthenticated, authLoading, user, navigate])

  useEffect(() => {
    fetchWipes()
  }, [])

  async function fetchWipes() {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_URL}/wipes/schedule`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setWipes(data.wipes || [])
      }
    } catch (error) {
      console.error('Error fetching wipes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_URL}/wipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({
          type: 'full',
          date: '',
          map_size: 4500,
          map_seed: '',
          notes: ''
        })
        setIsCreating(false)
        fetchWipes()
      }
    } catch (error) {
      console.error('Error creating wipe:', error)
    }
  }

  async function markComplete(id: number) {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_URL}/wipes/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchWipes()
      }
    } catch (error) {
      console.error('Error marking wipe complete:', error)
    }
  }

  function getWipeTypeColor(type: string) {
    switch (type) {
      case 'full':
        return 'bg-red-500/20 text-red-500'
      case 'map':
        return 'bg-blue-500/20 text-blue-500'
      case 'bp':
        return 'bg-yellow-500/20 text-yellow-500'
      default:
        return 'bg-dark-700 text-dark-400'
    }
  }

  function getWipeTypeName(type: string) {
    switch (type) {
      case 'full':
        return 'Full Wipe'
      case 'map':
        return 'Map Wipe'
      case 'bp':
        return 'BP Wipe'
      default:
        return type
    }
  }

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
      </div>
    )
  }

  const upcomingWipes = wipes.filter(w => !w.completed && new Date(w.date) >= new Date())
  const pastWipes = wipes.filter(w => w.completed || new Date(w.date) < new Date())

  return (
    <>
      <SEO title="Wipe Management" description="Manage server wipes and schedule" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Calendar className="w-10 h-10 text-rust-500" />
              Wipe Management
            </h1>
            <p className="text-dark-300">Schedule and track server wipes</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Schedule Wipe
            </button>
          )}
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Schedule New Wipe</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Wipe Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
                  >
                    <option value="full">Full Wipe (Map + BP)</option>
                    <option value="map">Map Only</option>
                    <option value="bp">Blueprint Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Wipe Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Map Size
                  </label>
                  <input
                    type="number"
                    value={formData.map_size}
                    onChange={(e) => setFormData({ ...formData, map_size: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
                    min="1000"
                    max="6000"
                    step="500"
                  />
                </div>

                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-2">
                    Map Seed (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.map_seed}
                    onChange={(e) => setFormData({ ...formData, map_seed: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
                    placeholder="Leave empty for random"
                  />
                </div>
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
                  rows={3}
                  placeholder="Any additional information about this wipe..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Schedule Wipe
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Upcoming Wipes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upcoming Wipes</h2>
          {upcomingWipes.length > 0 ? (
            <div className="space-y-4">
              {upcomingWipes.map((wipe) => (
                <div key={wipe.id} className="card hover:border-rust-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getWipeTypeColor(wipe.type)}`}>
                          {getWipeTypeName(wipe.type)}
                        </span>
                        <span className="text-white font-bold">
                          {new Date(wipe.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-dark-300 mb-2">
                        <span>Map Size: {wipe.map_size}</span>
                        {wipe.map_seed && <span>Seed: {wipe.map_seed}</span>}
                      </div>
                      {wipe.notes && (
                        <p className="text-dark-400 text-sm">{wipe.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => markComplete(wipe.id)}
                      className="btn-primary text-sm flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <Calendar className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">No upcoming wipes scheduled</p>
            </div>
          )}
        </div>

        {/* Past Wipes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Past Wipes</h2>
          {pastWipes.length > 0 ? (
            <div className="space-y-3">
              {pastWipes.slice(0, 10).map((wipe) => (
                <div key={wipe.id} className="card opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getWipeTypeColor(wipe.type)}`}>
                        {getWipeTypeName(wipe.type)}
                      </span>
                      <span className="text-dark-300">
                        {new Date(wipe.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-dark-400 text-sm">Map Size: {wipe.map_size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-dark-400">No past wipes</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminWipes
