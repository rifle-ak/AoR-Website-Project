import { Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import SEO from '../components/SEO'

const Rules = () => {
  const serverRules = [
    {
      title: "No Cheating or Exploiting",
      description: "Use of hacks, scripts, exploits, or any third-party software that gives unfair advantages is strictly prohibited. This includes ESP, aimbot, speedhacks, and similar tools.",
      severity: "ban"
    },
    {
      title: "No Racism, Hate Speech, or Harassment",
      description: "Treat all players with respect. Racism, homophobia, sexism, or targeted harassment of any kind will result in immediate removal from the server.",
      severity: "ban"
    },
    {
      title: "No Stream Sniping",
      description: "Targeting streamers based on information from their stream is not allowed. Play fair and respect content creators.",
      severity: "warning"
    },
    {
      title: "No Excessive Griefing",
      description: "While raiding is part of Rust, excessive griefing (foundation wiping, despawning loot, etc.) ruins the experience for everyone. Raid for loot, not destruction.",
      severity: "warning"
    },
    {
      title: "No Blocking Monuments or Resources",
      description: "Building on or excessively blocking monuments, caves, or key resource areas is prohibited. Everyone needs access to game content.",
      severity: "warning"
    },
    {
      title: "No Offensive Base Designs",
      description: "Bases with offensive symbols, shapes, or inappropriate designs will be removed. Keep it appropriate.",
      severity: "warning"
    },
    {
      title: "English in Global Chat",
      description: "Keep global chat primarily in English so everyone can understand. Use team chat or Discord for other languages.",
      severity: "info"
    },
    {
      title: "No Spam or Advertising",
      description: "Don't spam chat with repeated messages or advertise other servers/services. Discord links and trading are fine.",
      severity: "info"
    }
  ]

  const serverInfo = [
    { label: "Gather Rate", value: "2x" },
    { label: "Max Team Size", value: "4 Players" },
    { label: "Raid Protection", value: "Offline Raid Protection Enabled" },
    { label: "Map Size", value: import.meta.env.VITE_MAP_SIZE || "4500" },
    { label: "Wipe Schedule", value: "Bi-Weekly (Forced Wipe + Mid-Month)" },
    { label: "Admin Support", value: "24/7 Ticket System" },
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'ban':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <Shield className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'ban':
        return <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-500 font-medium">Instant Ban</span>
      case 'warning':
        return <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 font-medium">Warning/Kick</span>
      default:
        return <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500 font-medium">Info</span>
    }
  }

  return (
    <>
      <SEO
        title="Server Rules & Information"
        description="Read the official Art of Rust server rules, rates, and information. Follow these guidelines for the best gaming experience."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-rust-500" />
            Server Rules & Information
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Please read and follow these rules to ensure a fair and enjoyable experience for everyone on Art of Rust.
          </p>
        </div>

        {/* Server Info */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Info className="w-6 h-6 text-rust-500" />
            Server Information
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serverInfo.map((info, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <span className="text-dark-400 text-sm">{info.label}</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-white font-semibold mt-2">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rust-500" />
            Server Rules
          </h2>
          <div className="space-y-4">
            {serverRules.map((rule, index) => (
              <div key={index} className="card hover:border-rust-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getSeverityIcon(rule.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {index + 1}. {rule.title}
                      </h3>
                      {getSeverityBadge(rule.severity)}
                    </div>
                    <p className="text-dark-300">{rule.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 card bg-rust-500/10 border-rust-500/30">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-rust-500 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Have Questions?</h3>
              <p className="text-dark-300 mb-3">
                If you have questions about the rules or need to report a player, please open a ticket on our Discord server. Our admin team is here to help!
              </p>
              <a
                href={import.meta.env.VITE_DISCORD_INVITE || "https://discord.gg/artofrust"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block text-sm"
              >
                Open Discord Ticket
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Rules
