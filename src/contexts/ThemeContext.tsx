import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Theme, ThemeId, themes, defaultTheme } from '../config/themes'

interface ThemeContextType {
  theme: Theme
  themeId: ThemeId
  setTheme: (themeId: ThemeId) => void
  availableThemes: typeof themes
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'aor-theme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    // Load theme from localStorage on mount
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return (stored && stored in themes) ? stored as ThemeId : 'rust'
  })

  const [theme, setThemeState] = useState<Theme>(themes[themeId])

  const setTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId)
    setThemeState(themes[newThemeId])
    localStorage.setItem(THEME_STORAGE_KEY, newThemeId)
  }

  // Apply theme CSS variables to document root
  useEffect(() => {
    const root = document.documentElement

    // Apply all color variables
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value)
    })

    // Background colors
    root.style.setProperty('--color-bg-main', theme.colors.background.main)
    root.style.setProperty('--color-bg-secondary', theme.colors.background.secondary)
    root.style.setProperty('--color-bg-tertiary', theme.colors.background.tertiary)

    // Surface colors
    root.style.setProperty('--color-surface-main', theme.colors.surface.main)
    root.style.setProperty('--color-surface-secondary', theme.colors.surface.secondary)
    root.style.setProperty('--color-surface-hover', theme.colors.surface.hover)
    root.style.setProperty('--color-surface-border', theme.colors.surface.border)

    // Text colors
    root.style.setProperty('--color-text-primary', theme.colors.text.primary)
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary)
    root.style.setProperty('--color-text-tertiary', theme.colors.text.tertiary)
    root.style.setProperty('--color-text-disabled', theme.colors.text.disabled)
    root.style.setProperty('--color-text-inverse', theme.colors.text.inverse)

    // Status colors
    root.style.setProperty('--color-success', theme.colors.status.success)
    root.style.setProperty('--color-warning', theme.colors.status.warning)
    root.style.setProperty('--color-error', theme.colors.status.error)
    root.style.setProperty('--color-info', theme.colors.status.info)

    // Effects
    root.style.setProperty('--shadow', theme.effects.shadow)
    root.style.setProperty('--border-radius', theme.effects.borderRadius)
    if (theme.effects.glowColor) {
      root.style.setProperty('--glow-color', theme.effects.glowColor)
    }

    // Apply background color to body
    document.body.style.backgroundColor = theme.colors.background.main
    document.body.style.color = theme.colors.text.primary

    // Update meta theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute('content', theme.colors.background.main)
  }, [theme])

  const value: ThemeContextType = {
    theme,
    themeId,
    setTheme,
    availableThemes: themes,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
