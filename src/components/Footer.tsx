import { Link } from 'react-router-dom'
import { Mail, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-rust-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AOR</span>
              </div>
              <span className="text-white font-bold text-xl">Art of Rust</span>
            </div>
            <p className="text-dark-400 text-sm">
              The ultimate Rust gaming experience with dedicated servers and an amazing community.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-dark-400 hover:text-rust-500 transition-colors">Home</Link></li>
              <li><Link to="/commands" className="text-dark-400 hover:text-rust-500 transition-colors">Server Commands</Link></li>
              <li><Link to="/gallery" className="text-dark-400 hover:text-rust-500 transition-colors">Gallery</Link></li>
              <li><a href="https://upgrade.chat/artofrust" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-rust-500 transition-colors flex items-center space-x-1">
                <span>Donate</span>
                <ExternalLink className="w-3 h-3" />
              </a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <a href="mailto:ArtofRustMedia@gmail.com" className="text-dark-400 hover:text-rust-500 transition-colors flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>ArtofRustMedia@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-dark-700 text-center text-sm text-dark-400">
          <p>Copyright © 2025 Art Of Rust - All Rights Reserved.</p>
          <p className="mt-2">
            Rust and associated Rust images are copyright of Facepunch Studios LTD.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
