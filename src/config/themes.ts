export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    // Primary brand colors
    primary: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
    // Background colors
    background: {
      main: string
      secondary: string
      tertiary: string
    }
    // Surface colors (cards, panels)
    surface: {
      main: string
      secondary: string
      hover: string
      border: string
    }
    // Text colors
    text: {
      primary: string
      secondary: string
      tertiary: string
      disabled: string
      inverse: string
    }
    // Status colors
    status: {
      success: string
      warning: string
      error: string
      info: string
    }
  }
  // Additional styling
  effects: {
    shadow: string
    borderRadius: string
    glowColor?: string
  }
}

// Rust Game Theme - Default theme inspired by the game
export const rustTheme: Theme = {
  id: 'rust',
  name: 'Rust',
  description: 'Official Rust game theme with post-apocalyptic aesthetics',
  colors: {
    primary: {
      50: '#fef7ed',
      100: '#fdedd3',
      200: '#fbd8a5',
      300: '#f8bc6d',
      400: '#f59446',
      500: '#f37320', // Main rust orange
      600: '#e45a16',
      700: '#bd4315',
      800: '#973618',
      900: '#7b2e16',
    },
    background: {
      main: '#0f172a',      // Very dark blue-gray
      secondary: '#1e293b', // Dark slate
      tertiary: '#0a0e1a',  // Almost black
    },
    surface: {
      main: '#1e293b',      // Dark slate
      secondary: '#334155', // Lighter slate
      hover: '#475569',     // Even lighter on hover
      border: '#475569',    // Border color
    },
    text: {
      primary: '#f8fafc',   // Almost white
      secondary: '#cbd5e1', // Light gray
      tertiary: '#94a3b8',  // Medium gray
      disabled: '#64748b',  // Muted gray
      inverse: '#0f172a',   // For light backgrounds
    },
    status: {
      success: '#22c55e',   // Green
      warning: '#eab308',   // Yellow
      error: '#ef4444',     // Red
      info: '#3b82f6',      // Blue
    },
  },
  effects: {
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    borderRadius: '0.5rem',
    glowColor: 'rgba(243, 115, 32, 0.2)', // Rust glow
  },
}

// Dark Theme - Clean, modern dark theme
export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  description: 'Clean and modern dark theme',
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Sky blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    background: {
      main: '#000000',
      secondary: '#18181b',
      tertiary: '#09090b',
    },
    surface: {
      main: '#18181b',
      secondary: '#27272a',
      hover: '#3f3f46',
      border: '#3f3f46',
    },
    text: {
      primary: '#fafafa',
      secondary: '#d4d4d8',
      tertiary: '#a1a1aa',
      disabled: '#71717a',
      inverse: '#000000',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#f43f5e',
      info: '#3b82f6',
    },
  },
  effects: {
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    borderRadius: '0.5rem',
  },
}

// Light Theme - Clean light theme
export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  description: 'Clean and bright light theme',
  colors: {
    primary: {
      50: '#fef7ed',
      100: '#fdedd3',
      200: '#fbd8a5',
      300: '#f8bc6d',
      400: '#f59446',
      500: '#f37320',
      600: '#e45a16',
      700: '#bd4315',
      800: '#973618',
      900: '#7b2e16',
    },
    background: {
      main: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    surface: {
      main: '#ffffff',
      secondary: '#f8fafc',
      hover: '#e2e8f0',
      border: '#e2e8f0',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      disabled: '#94a3b8',
      inverse: '#ffffff',
    },
    status: {
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
      info: '#2563eb',
    },
  },
  effects: {
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    borderRadius: '0.5rem',
  },
}

// Forest Theme - Nature-inspired green theme
export const forestTheme: Theme = {
  id: 'forest',
  name: 'Forest',
  description: 'Nature-inspired dark green theme',
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    background: {
      main: '#0a1810',
      secondary: '#1a2820',
      tertiary: '#0d1f17',
    },
    surface: {
      main: '#1a2820',
      secondary: '#2d3f35',
      hover: '#3d5046',
      border: '#3d5046',
    },
    text: {
      primary: '#f0fdf4',
      secondary: '#bbf7d0',
      tertiary: '#86efac',
      disabled: '#4d7c5f',
      inverse: '#0a1810',
    },
    status: {
      success: '#22c55e',
      warning: '#fbbf24',
      error: '#ef4444',
      info: '#06b6d4',
    },
  },
  effects: {
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    borderRadius: '0.5rem',
    glowColor: 'rgba(34, 197, 94, 0.15)',
  },
}

// Ocean Theme - Blue ocean theme
export const oceanTheme: Theme = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Deep ocean blue theme',
  colors: {
    primary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4', // Cyan
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    background: {
      main: '#0a1628',
      secondary: '#162642',
      tertiary: '#0d1f35',
    },
    surface: {
      main: '#162642',
      secondary: '#1e3a5f',
      hover: '#2d4b73',
      border: '#2d4b73',
    },
    text: {
      primary: '#ecfeff',
      secondary: '#a5f3fc',
      tertiary: '#67e8f9',
      disabled: '#475569',
      inverse: '#0a1628',
    },
    status: {
      success: '#14b8a6',
      warning: '#f59e0b',
      error: '#f43f5e',
      info: '#06b6d4',
    },
  },
  effects: {
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    borderRadius: '0.5rem',
    glowColor: 'rgba(6, 182, 212, 0.15)',
  },
}

export const themes = {
  rust: rustTheme,
  dark: darkTheme,
  light: lightTheme,
  forest: forestTheme,
  ocean: oceanTheme,
}

export type ThemeId = keyof typeof themes

export const defaultTheme = rustTheme
