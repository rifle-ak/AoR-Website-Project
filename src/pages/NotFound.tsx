import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
      <div className="min-h-[600px] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-500 mb-2">404</h1>
          <div className="flex items-center justify-center gap-2 text-text-tertiary">
            <Search className="w-5 h-5" />
            <p className="text-lg">Page Not Found</p>
          </div>
        </div>

        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-text-tertiary mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <Link to="/commands" className="text-primary-500 hover:text-primary-400 transition-colors">
              Commands
            </Link>
            <span className="text-text-disabled">•</span>
            <Link to="/gallery" className="text-primary-500 hover:text-primary-400 transition-colors">
              Gallery
            </Link>
            <span className="text-text-disabled">•</span>
            <Link to="/login" className="text-primary-500 hover:text-primary-400 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
