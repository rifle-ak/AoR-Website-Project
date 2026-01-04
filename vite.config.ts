import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin } from 'vite'

// Security headers plugin for development server
function securityHeadersPlugin(): Plugin {
  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Content Security Policy
        res.setHeader(
          'Content-Security-Policy',
          [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline and unsafe-eval needed for Vite dev
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' ws: wss: http: https:",
            "frame-ancestors 'none'",
          ].join('; ')
        )

        // Prevent clickjacking
        res.setHeader('X-Frame-Options', 'DENY')

        // Prevent MIME type sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff')

        // XSS Protection (legacy browsers)
        res.setHeader('X-XSS-Protection', '1; mode=block')

        // Referrer Policy
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

        // Permissions Policy
        res.setHeader(
          'Permissions-Policy',
          'geolocation=(), microphone=(), camera=(), payment=()'
        )

        // HSTS (HTTPS only - uncomment when using HTTPS)
        // res.setHeader(
        //   'Strict-Transport-Security',
        //   'max-age=31536000; includeSubDomains; preload'
        // )

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    // Security-related build options
    sourcemap: false, // Disable sourcemaps in production for security
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
  },
})
