import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Twitter, Youtube, Instagram, LogOut, User as UserIcon, Shield } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'
import { useAuth } from '../contexts/AuthContext'

// Discord icon component (lucide-react doesn't include Discord)
const Discord = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, login, logout } = useAuth()

  const leaderboardsEnabled = import.meta.env.VITE_ENABLE_LEADERBOARDS === 'true'

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
    ...(leaderboardsEnabled ? [{ name: 'Leaderboards', href: '/leaderboards' }] : []),
    { name: 'Wipe Schedule', href: '/wipe-schedule' },
    { name: 'Commands', href: '/commands' },
    { name: 'Rules', href: '/rules' },
    { name: 'Gallery', href: '/gallery' },
  ]

  const socialLinks = [
    { icon: Discord, href: 'https://discord.gg/artofrust', label: 'Discord' },
    { icon: Twitter, href: 'https://x.com/ArtofRust', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/@ArtofRust', label: 'YouTube' },
    { icon: Instagram, href: 'https://www.instagram.com/ArtofRust', label: 'Instagram' },
  ]

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-rust-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AOR</span>
              </div>
              <span className="text-white font-bold text-xl">Art of Rust</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-rust-500'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-rust-500 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
            <ThemeSwitcher />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border-2 border-rust-500"
                    />
                  )}
                  <span className="text-white text-sm font-medium">{user.displayName}</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg z-20">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-3 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors border-t border-dark-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={login}
                className="btn-primary text-sm"
              >
                Login with Steam
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? 'text-rust-500 bg-dark-700'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 px-3 py-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-rust-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="px-3 py-2">
              <ThemeSwitcher />
            </div>
            {user ? (
              <div className="px-3 py-2">
                <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-dark-700">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border-2 border-rust-500"
                    />
                  )}
                  <span className="text-white text-sm font-medium">{user.displayName}</span>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-dark-300 hover:text-white hover:bg-dark-700 mb-2"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  My Profile
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-dark-300 hover:text-white hover:bg-dark-700 mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full btn-secondary text-sm mt-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 py-2">
                <button
                  onClick={() => {
                    login()
                    setIsOpen(false)
                  }}
                  className="w-full btn-primary text-sm"
                >
                  Login with Steam
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
