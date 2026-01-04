import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Discord, Twitter, Youtube, Instagram } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Commands', href: '/commands' },
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
            <Link
              to="/login"
              className="btn-primary text-sm"
            >
              Login
            </Link>
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
            <Link
              to="/login"
              className="block px-3 py-2 btn-primary text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
