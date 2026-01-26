import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { logError } from '../services/monitoring'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service (Sentry-ready)
    logError(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
          <div className="max-w-md w-full">
            <div className="card text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h1>

              <p className="text-dark-300 mb-6">
                We're sorry for the inconvenience. The error has been logged and we'll look into it.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 mb-6 text-left">
                  <p className="text-red-400 text-sm font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-dark-400 text-xs overflow-auto max-h-48">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-secondary"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
