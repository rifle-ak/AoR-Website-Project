/**
 * Error Monitoring Service
 *
 * This module provides error tracking and monitoring capabilities.
 * It's pre-configured to work with Sentry but can be adapted for other services.
 *
 * To enable Sentry:
 * 1. Install: npm install @sentry/react
 * 2. Set VITE_SENTRY_DSN in your .env file
 * 3. Uncomment the Sentry initialization code in main.tsx
 */

import { ErrorInfo } from 'react'

interface ErrorContext {
  errorInfo?: ErrorInfo
  [key: string]: unknown
}

/**
 * Log error to monitoring service
 * This function is called by ErrorBoundary and can be called manually
 */
export function logError(error: Error, context?: ErrorContext): void {
  // Console logging for development
  if (import.meta.env.DEV) {
    console.error('Error logged to monitoring service:', {
      error,
      context,
      timestamp: new Date().toISOString(),
    })
  }

  // Send to Sentry if available
  // Uncomment when Sentry is installed and configured
  /*
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const Sentry = (window as any).Sentry
    Sentry.captureException(error, {
      contexts: {
        react: context?.errorInfo,
        ...context,
      },
    })
  }
  */

  // Alternative: Send to custom error logging endpoint
  /*
  if (import.meta.env.VITE_ERROR_LOGGING_ENDPOINT) {
    fetch(import.meta.env.VITE_ERROR_LOGGING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(console.error)
  }
  */
}

/**
 * Log a message to monitoring service
 */
export function logMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (import.meta.env.DEV) {
    console[level](message)
  }

  // Uncomment when Sentry is configured
  /*
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const Sentry = (window as any).Sentry
    Sentry.captureMessage(message, level)
  }
  */
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id: string; username?: string; email?: string }): void {
  if (import.meta.env.DEV) {
    console.log('User context set:', user)
  }

  // Uncomment when Sentry is configured
  /*
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const Sentry = (window as any).Sentry
    Sentry.setUser({
      id: user.id,
      username: user.username,
      email: user.email,
    })
  }
  */
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  if (import.meta.env.DEV) {
    console.log('User context cleared')
  }

  // Uncomment when Sentry is configured
  /*
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const Sentry = (window as any).Sentry
    Sentry.setUser(null)
  }
  */
}

/**
 * Add breadcrumb for debugging context
 */
export function addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): void {
  if (import.meta.env.DEV) {
    console.log(`[Breadcrumb] ${category || 'general'}: ${message}`)
  }

  // Uncomment when Sentry is configured
  /*
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const Sentry = (window as any).Sentry
    Sentry.addBreadcrumb({
      message,
      category,
      level: level || 'info',
      timestamp: Date.now(),
    })
  }
  */
}

/**
 * Performance monitoring
 */
export function trackPerformance(name: string, duration: number): void {
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${name}: ${duration}ms`)
  }

  // Uncomment when Sentry performance monitoring is configured
  /*
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const Sentry = (window as any).Sentry
    const transaction = Sentry.startTransaction({ name })
    setTimeout(() => {
      transaction.finish()
    }, duration)
  }
  */
}

// Setup instructions for Sentry
export const SENTRY_SETUP_INSTRUCTIONS = `
To enable Sentry error monitoring:

1. Install Sentry SDK:
   npm install @sentry/react

2. Add to .env:
   VITE_SENTRY_DSN=your-sentry-dsn-here
   VITE_SENTRY_ENVIRONMENT=production

3. Update src/main.tsx - add before ReactDOM.createRoot():

   import * as Sentry from '@sentry/react'

   if (import.meta.env.VITE_SENTRY_DSN) {
     Sentry.init({
       dsn: import.meta.env.VITE_SENTRY_DSN,
       environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
       integrations: [
         new Sentry.BrowserTracing(),
         new Sentry.Replay({
           maskAllText: false,
           blockAllMedia: false,
         }),
       ],
       tracesSampleRate: 1.0,
       replaysSessionSampleRate: 0.1,
       replaysOnErrorSampleRate: 1.0,
     })
   }

4. Uncomment Sentry code in src/services/monitoring.ts

5. Update ErrorBoundary import in src/components/ErrorBoundary.tsx

For more info: https://docs.sentry.io/platforms/javascript/guides/react/
`
