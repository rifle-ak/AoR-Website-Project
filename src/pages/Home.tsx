import { Link } from 'react-router-dom'
import { Server, Shield, Zap } from 'lucide-react'
import SEO from '../components/SEO'
import ServerStatus from '../components/ServerStatus'
import DiscordWidget from '../components/DiscordWidget'

const Home = () => {
  const features = [
    {
      icon: Server,
      title: "High Performance",
      description: "Optimized servers with minimal lag and maximum uptime"
    },
    {
      icon: Shield,
      title: "Active Admins",
      description: "24/7 admin support to ensure fair gameplay"
    },
    {
      icon: Zap,
      title: "Custom Events",
      description: "Regular events and unique gameplay experiences"
    }
  ]

  return (
    <>
      <SEO />
      <div className="space-y-16">
      <section className="relative bg-gradient-to-br from-dark-800 to-dark-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Welcome to <span className="text-rust-500">Art of Rust</span>
              </h1>
              <p className="text-xl text-dark-300 mb-8">
                Experience Rust like never before. Join our thriving community of survivors, builders, and warriors in the ultimate survival adventure.
              </p>
              <p className="text-lg text-dark-50 italic mb-4">
                "Explore. Build. Survive."
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={import.meta.env.VITE_DISCORD_INVITE || "https://discord.gg/artofrust"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Join Discord
                </a>
                <Link
                  to="/commands"
                  className="btn-secondary"
                >
                  View Commands
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <ServerStatus />
              <DiscordWidget />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Art of Rust?
            </h2>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              We provide the best Rust gaming experience with dedicated servers and an amazing community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-rust-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Join Our Community
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={import.meta.env.VITE_DISCORD_INVITE || "https://discord.gg/artofrust"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Join Discord
              </a>
              <Link
                to="/gallery"
                className="btn-secondary"
              >
                View Gallery
              </Link>
              <Link
                to="/commands"
                className="btn-secondary"
              >
                Server Commands
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default Home
