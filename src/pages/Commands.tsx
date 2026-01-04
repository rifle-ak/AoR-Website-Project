import { useState } from 'react'
import { Search, Copy, Check, Terminal, AlertCircle } from 'lucide-react'
import { copyToClipboard as copyToClipboardUtil } from '../utils/clipboard'

const Commands = () => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleCopyToClipboard = async (command: string) => {
    const success = await copyToClipboardUtil(command)

    if (success) {
      setCopiedCommand(command)
      setCopyError(null)
      setTimeout(() => setCopiedCommand(null), 2000)
    } else {
      setCopyError(command)
      setTimeout(() => setCopyError(null), 3000)
    }
  }

  const rustCommands = [
    {
      category: "Basic Commands",
      commands: [
        { command: "/help", description: "Shows all available commands" },
        { command: "/stats", description: "Display your player statistics" },
        { command: "/info", description: "Show server information" },
        { command: "/rules", description: "Display server rules" },
        { command: "/kit starter", description: "Get a starter kit" },
      ]
    },
    {
      category: "Teleportation",
      commands: [
        { command: "/home", description: "Teleport to your home base" },
        { command: "/sethome", description: "Set your home location" },
        { command: "/tpa <player>", description: "Send teleport request to player" },
        { command: "/tpaccept", description: "Accept teleport request" },
        { command: "/tpdeny", description: "Deny teleport request" },
      ]
    },
    {
      category: "Economy",
      commands: [
        { command: "/balance", description: "Check your balance" },
        { command: "/pay <player> <amount>", description: "Pay money to another player" },
        { command: "/shop", description: "Open the server shop" },
        { command: "/sell", description: "Sell items in your hand" },
        { command: "/worth", description: "Check value of items in hand" },
      ]
    },
    {
      category: "Clan System",
      commands: [
        { command: "/clan create <name>", description: "Create a new clan" },
        { command: "/clan invite <player>", description: "Invite player to clan" },
        { command: "/clan join <clan>", description: "Join a clan" },
        { command: "/clan leave", description: "Leave your current clan" },
        { command: "/clan info", description: "Show clan information" },
      ]
    },
    {
      category: "Admin Commands",
      commands: [
        { command: "/kick <player>", description: "Kick a player from server" },
        { command: "/ban <player>", description: "Ban a player from server" },
        { command: "/mute <player>", description: "Mute a player" },
        { command: "/vanish", description: "Become invisible" },
        { command: "/godmode", description: "Enable god mode" },
      ]
    }
  ]

  const filteredCommands = rustCommands.map(category => ({
    ...category,
    commands: category.commands.filter(cmd => 
      cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.commands.length > 0)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Rust Server Commands</h1>
          <p className="text-lg text-dark-300 max-w-3xl mx-auto">
            Complete list of commands available on our Art of Rust servers. Click on any command to copy it to your clipboard.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredCommands.map((category, categoryIndex) => (
            <div key={categoryIndex} className="card">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Terminal className="w-6 h-6 text-rust-500 mr-3" />
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {category.commands.map((cmd, cmdIndex) => (
                  <div key={cmdIndex} className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-rust-500 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <code className="text-rust-400 font-mono text-sm">{cmd.command}</code>
                        <p className="text-dark-300 text-sm mt-1">{cmd.description}</p>
                      </div>
                      <button
                        onClick={() => handleCopyToClipboard(cmd.command)}
                        className="ml-3 flex items-center space-x-1 text-rust-500 hover:text-rust-400 transition-colors flex-shrink-0"
                        title="Copy command"
                        aria-label={`Copy ${cmd.command}`}
                      >
                        {copiedCommand === cmd.command ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : copyError === cmd.command ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-400 text-lg">No commands found matching "{searchTerm}"</p>
          </div>
        )}

        <div className="mt-12 card">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Tips</h3>
          <ul className="space-y-2 text-dark-300">
            <li>• Use the <code className="text-rust-400">/help</code> command in-game to see all available commands</li>
            <li>• Most commands require you to type them in the game chat</li>
            <li>• Admin commands require special permissions</li>
            <li>• Some commands may have cooldowns to prevent spam</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Commands
