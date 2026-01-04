import { useState } from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { ThemeId } from '../config/themes'

export default function ThemeSwitcher() {
  const { theme, themeId, setTheme, availableThemes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeSelect = (newThemeId: ThemeId) => {
    setTheme(newThemeId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface-main hover:bg-surface-hover transition-colors border border-surface-border"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <Palette className="w-5 h-5 text-primary-500" />
        <span className="text-sm font-medium text-text-primary hidden sm:inline">
          {theme.name}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-72 bg-surface-main border border-surface-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b border-surface-border">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Choose Theme
              </h3>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto">
              {Object.entries(availableThemes).map(([id, themeOption]) => {
                const isSelected = id === themeId
                return (
                  <button
                    key={id}
                    onClick={() => handleThemeSelect(id as ThemeId)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary-500/10 border border-primary-500/30'
                        : 'hover:bg-surface-hover border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${
                            isSelected ? 'text-primary-500' : 'text-text-primary'
                          }`}>
                            {themeOption.name}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-text-tertiary line-clamp-2">
                          {themeOption.description}
                        </p>

                        {/* Color preview */}
                        <div className="flex gap-1 mt-2">
                          <div
                            className="w-4 h-4 rounded-full border border-surface-border"
                            style={{ backgroundColor: themeOption.colors.primary[500] }}
                            title="Primary color"
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-surface-border"
                            style={{ backgroundColor: themeOption.colors.background.main }}
                            title="Background color"
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-surface-border"
                            style={{ backgroundColor: themeOption.colors.surface.main }}
                            title="Surface color"
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-2 border-t border-surface-border bg-surface-secondary/50">
              <p className="text-xs text-text-tertiary text-center">
                Theme preference saved locally
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
