import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import SEO from '../components/SEO'
import { useAuth } from '../contexts/AuthContext'

interface NewsPost {
  id: number
  title: string
  content: string
  excerpt: string
  author_name: string
  published: boolean
  created_at: string
  updated_at: string
}

const AdminNews = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false
  })
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      navigate('/admin')
    }
  }, [isAuthenticated, authLoading, user, navigate])

  useEffect(() => {
    fetchAllNews()
  }, [])

  async function fetchAllNews() {
    try {
      const token = localStorage.getItem('auth_token')
      // Fetch all news including unpublished (admin view)
      const response = await fetch(`${API_URL}/news?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const token = localStorage.getItem('auth_token')
      const url = editingPost
        ? `${API_URL}/news/${editingPost.id}`
        : `${API_URL}/news`

      const method = editingPost ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ title: '', content: '', excerpt: '', published: false })
        setEditingPost(null)
        setIsCreating(false)
        fetchAllNews()
      }
    } catch (error) {
      console.error('Error saving news:', error)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this news post?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchAllNews()
      }
    } catch (error) {
      console.error('Error deleting news:', error)
    }
  }

  function startEdit(post: NewsPost) {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      published: post.published
    })
    setIsCreating(true)
  }

  function cancelEdit() {
    setEditingPost(null)
    setIsCreating(false)
    setFormData({ title: '', content: '', excerpt: '', published: false })
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
      <SEO title="News Management" description="Manage news and announcements" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Newspaper className="w-10 h-10 text-rust-500" />
              News Management
            </h1>
            <p className="text-dark-300">Create and manage server announcements</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
                  required
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Excerpt (Optional)
                </label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500"
                  placeholder="Short summary for preview..."
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-rust-500 min-h-[200px]"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-rust-500 bg-dark-800 border-dark-700 rounded focus:ring-rust-500"
                />
                <label htmlFor="published" className="text-dark-300 text-sm">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="card hover:border-rust-500/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{post.title}</h3>
                      {post.published ? (
                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-500 text-xs font-medium flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-xs font-medium flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-dark-300 mb-3">{post.excerpt || post.content.substring(0, 150) + '...'}</p>
                    <div className="flex items-center gap-4 text-sm text-dark-400">
                      <span>By {post.author_name}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(post)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Newspaper className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-300 mb-2">No News Posts</h3>
            <p className="text-dark-400 mb-4">Create your first announcement to get started.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminNews
