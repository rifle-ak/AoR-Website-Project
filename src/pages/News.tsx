import { useEffect, useState } from 'react'
import { Newspaper, Calendar, User } from 'lucide-react'
import SEO from '../components/SEO'

interface NewsPost {
  id: number
  title: string
  content: string
  excerpt: string
  author_name: string
  author_avatar?: string
  created_at: string
}

const News = () => {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
        const response = await fetch(`${API_URL}/news`)
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <SEO
        title="News & Updates"
        description="Stay updated with the latest news, announcements, and events from Art of Rust."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Newspaper className="w-10 h-10 text-rust-500" />
            News & Updates
          </h1>
          <p className="text-dark-300 text-lg">
            Latest server news, events, and announcements
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rust-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="card text-center py-12">
            <Newspaper className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-300 mb-2">No news yet</h3>
            <p className="text-dark-400">Check back later for updates!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.id} className="card hover:border-rust-500/30 transition-colors">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {post.title}
                </h2>

                <div className="flex items-center gap-4 text-sm text-dark-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.created_at)}
                  </div>
                  {post.author_name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author_name}
                    </div>
                  )}
                </div>

                <div className="text-dark-200 prose prose-invert max-w-none">
                  {post.excerpt || post.content}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default News
