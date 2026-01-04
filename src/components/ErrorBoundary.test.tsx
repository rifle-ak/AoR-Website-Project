import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import ErrorBoundary from './ErrorBoundary'

const ThrowError = () => {
  throw new Error('Test error')
}

const WorkingComponent = () => <div>Working</div>

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Working')).toBeInTheDocument()
  })

  it('should render error UI when an error is thrown', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = () => {}

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/try again/i)).toBeInTheDocument()

    console.error = originalError
  })

  it('should render custom fallback when provided', () => {
    const originalError = console.error
    console.error = () => {}

    const customFallback = <div>Custom Error Message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom Error Message')).toBeInTheDocument()

    console.error = originalError
  })
})
