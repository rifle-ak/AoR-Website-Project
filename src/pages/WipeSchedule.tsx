import { useState, useEffect } from 'react'
import { Calendar, Clock, AlertCircle, History, RefreshCw, MapPin } from 'lucide-react'
import SEO from '../components/SEO'

interface WipeEvent {
  id: string
  type: 'full' | 'map' | 'bp'
  date: string
  completed: boolean
  mapSize?: number
  mapSeed?: string
  notes?: string
}

const WipeSchedule = () => {
  const [nextWipe, _setNextWipe] = useState<WipeEvent>({
    id: '1',
    type: 'full',
    date: '2026-01-08T19:00:00Z',
    completed: false,
    mapSize: 4000,
    notes: 'Monthly force wipe - Full wipe including blueprints'
  })

  const [upcomingWipes, _setUpcomingWipes] = useState<WipeEvent[]>([
    {
      id: '2',
      type: 'map',
      date: '2026-01-15T19:00:00Z',
      completed: false,
      mapSize: 4000,
      notes: 'Map wipe only - Blueprints preserved'
    },
    {
      id: '3',
      type: 'map',
      date: '2026-01-22T19:00:00Z',
      completed: false,
      mapSize: 4000,
      notes: 'Map wipe only'
    }
  ])

  const [wipeHistory, _setWipeHistory] = useState<WipeEvent[]>([
    {
      id: 'h1',
      type: 'full',
      date: '2026-01-01T19:00:00Z',
      completed: true,
      mapSize: 4000,
      mapSeed: '12345678',
      notes: 'New Year force wipe'
    },
    {
      id: 'h2',
      type: 'map',
      date: '2025-12-25T19:00:00Z',
      completed: true,
      mapSize: 4000,
      mapSeed: '87654321',
      notes: 'Christmas map wipe'
    }
  ])

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchWipeSchedule = async () => {
    //   const response = await fetch('/api/wipes/schedule')
    //   const data = await response.json()
    //   setNextWipe(data.next)
    //   setUpcomingWipes(data.upcoming)
    //   setWipeHistory(data.history)
    // }
    // fetchWipeSchedule()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const wipeTime = new Date(nextWipe.date).getTime()
      const distance = wipeTime - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [nextWipe.date])

  const getWipeTypeColor = (type: WipeEvent['type']) => {
    switch (type) {
      case 'full':
        return 'bg-red-500'
      case 'map':
        return 'bg-yellow-500'
      case 'bp':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getWipeTypeLabel = (type: WipeEvent['type']) => {
    switch (type) {
      case 'full':
        return 'Full Wipe'
      case 'map':
        return 'Map Only'
      case 'bp':
        return 'BP Wipe'
      default:
        return 'Unknown'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    return formatDate(dateString)
  }

  return (
    <>
      <SEO
        title="Wipe Schedule"
        description="View the wipe schedule for Art of Rust servers. Stay updated on upcoming map and blueprint wipes."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Calendar className="w-10 h-10 text-rust-500" />
            Wipe Schedule
          </h1>
          <p className="text-dark-300 text-lg">
            Plan your gameplay around our regular wipe schedule. Never miss a fresh start!
          </p>
        </div>

        {/* Next Wipe Countdown */}
        <div className="card mb-8 bg-gradient-to-br from-rust-900/20 to-dark-800 border-2 border-rust-500/30">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getWipeTypeColor(nextWipe.type)}`}>
                  {getWipeTypeLabel(nextWipe.type)}
                </span>
                <RefreshCw className="w-4 h-4 text-rust-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Next Wipe</h2>
              <p className="text-dark-300 text-sm mt-1">{formatDate(nextWipe.date)}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-rust-500" />
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds }
            ].map((unit) => (
              <div key={unit.label} className="bg-dark-900/50 rounded-lg p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold text-rust-500 mb-1">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-dark-400 uppercase tracking-wide">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Wipe Details */}
          {nextWipe.notes && (
            <div className="bg-dark-900/30 rounded-lg p-4 border border-dark-700">
              <p className="text-dark-200 text-sm">{nextWipe.notes}</p>
              {nextWipe.mapSize && (
                <div className="flex items-center gap-4 mt-3 text-xs text-dark-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Map Size: {nextWipe.mapSize}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Wipes */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-rust-500" />
              Upcoming Wipes
            </h3>
            <div className="space-y-3">
              {upcomingWipes.map((wipe) => (
                <div
                  key={wipe.id}
                  className="bg-dark-900 rounded-lg p-4 border border-dark-700 hover:border-rust-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getWipeTypeColor(wipe.type)}`}></span>
                      <span className="text-white font-semibold">{getWipeTypeLabel(wipe.type)}</span>
                    </div>
                    <span className="text-xs text-dark-400">{formatRelativeDate(wipe.date)}</span>
                  </div>
                  <p className="text-sm text-dark-300 mb-1">{formatDate(wipe.date)}</p>
                  {wipe.notes && (
                    <p className="text-xs text-dark-400 mt-2">{wipe.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wipe History */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-6 h-6 text-rust-500" />
              Recent Wipes
            </h3>
            <div className="space-y-3">
              {wipeHistory.map((wipe) => (
                <div
                  key={wipe.id}
                  className="bg-dark-900 rounded-lg p-4 border border-dark-700 opacity-75"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getWipeTypeColor(wipe.type)}`}></span>
                      <span className="text-white font-semibold">{getWipeTypeLabel(wipe.type)}</span>
                    </div>
                    <span className="text-xs text-dark-400">
                      {new Date(wipe.date).toLocaleDateString()}
                    </span>
                  </div>
                  {wipe.mapSeed && (
                    <div className="text-xs text-dark-400 font-mono">
                      Seed: {wipe.mapSeed}
                    </div>
                  )}
                  {wipe.notes && (
                    <p className="text-xs text-dark-400 mt-2">{wipe.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wipe Info */}
        <div className="card mt-8 bg-dark-900/50 border border-rust-500/20">
          <h3 className="text-lg font-bold text-white mb-4">Wipe Information</h3>
          <div className="space-y-3 text-sm text-dark-300">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
              <div>
                <strong className="text-white">Full Wipe:</strong> Everything is wiped including blueprints.
                Fresh start for all players. Occurs on Facepunch force wipe (first Thursday of each month).
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1 flex-shrink-0"></div>
              <div>
                <strong className="text-white">Map Wipe:</strong> Only the map is wiped.
                Players keep their blueprints. Occurs weekly on Thursdays.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
              <div>
                <strong className="text-white">BP Wipe:</strong> Only blueprints are wiped.
                Map remains. Rare occurrence for special events.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WipeSchedule
