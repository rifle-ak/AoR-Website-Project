import React, { useState, useEffect } from 'react'
import { Users, Copy, Check, Server, Shield, Zap } from 'lucide-react'

const Home = () => {
  const [copied, setCopied] = useState(false)
  const [serverStatus, setServerStatus] = useState({
    online: 19,
    max: 100,
    status: 'online'
  })

  const serverConnectCommand = "client.connect 188.64.33.62:28017"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverConnectCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setServerStatus(prev => ({
        ...prev,
        online: Math.max(15, Math.min(100, prev.online + Math.floor(Math.random() * 5) - 2))
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

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
    <div className="space-y-16">
      <section className="relative bg-gradient-to-br from-dark-800 to-dark-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-rust-500">Art of Rust</span>
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
              Experience Rust like never before. Join our thriving community of survivors, builders, and warriors in the ultimate survival adventure.
            </p>
            
            <div className="bg-dark-700 border border-dark-600 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-rust-500" />
                  <span className="text-dark-300">Server Status</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-500 text-sm font-medium">Online</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-dark-400">Players</span>
                  <span className="text-dark-200">{serverStatus.online}/{serverStatus.max}</span>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-2">
                  <div 
                    className="bg-rust-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(serverStatus.online / serverStatus.max) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-dark-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <code className="text-rust-400 text-sm">{serverConnectCommand}</code>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 text-rust-500 hover:text-rust-400 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
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
                href="https://discord.gg/artofrust"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Join Discord
              </a>
              <a
                href="/gallery"
                className="btn-secondary"
              >
                View Gallery
              </a>
              <a
                href="/commands"
                className="btn-secondary"
              >
                Server Commands
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
