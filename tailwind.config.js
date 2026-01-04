/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Rust game brand colors
        rust: {
          50: '#fdeae8',
          100: '#fad4d0',
          200: '#f5a9a1',
          300: '#f07e72',
          400: '#eb5343',
          500: '#cd412b',  // Primary brand color (Valencia)
          600: '#a43422',
          700: '#7b271a',
          800: '#521a11',
          900: '#290d09',
        },
        // Updated dark palette to match Rust's gritty aesthetic
        dark: {
          50: '#e4dad1',   // Pearl Bush (secondary brand color)
          100: '#c7bdb4',
          200: '#a9a097',
          300: '#8c837a',
          400: '#6e665d',
          500: '#514940',
          600: '#3d3630',
          700: '#292320',
          800: '#1d1814',
          900: '#131210',  // Cod Gray (tertiary brand color)
        },
        // Dynamic theme colors using CSS variables
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        // Background colors
        'bg-main': 'var(--color-bg-main)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        // Surface colors
        'surface-main': 'var(--color-surface-main)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-hover': 'var(--color-surface-hover)',
        'surface-border': 'var(--color-surface-border)',
        // Text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-disabled': 'var(--color-text-disabled)',
        'text-inverse': 'var(--color-text-inverse)',
        // Status colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        'rust': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'theme': 'var(--shadow)',
      },
      borderRadius: {
        'theme': 'var(--border-radius)',
      }
    },
  },
  plugins: [],
}
