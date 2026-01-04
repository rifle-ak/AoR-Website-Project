/**
 * API Client Configuration
 * Centralized API layer for all HTTP requests
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000')

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export class ApiException extends Error {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiException'
    this.status = status
    this.code = code
  }
}

interface RequestConfig extends RequestInit {
  timeout?: number
}

/**
 * Base fetch wrapper with error handling and timeout
 */
async function fetchWithTimeout(
  url: string,
  config: RequestConfig = {}
): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchConfig } = config

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiException('Request timeout', 408, 'TIMEOUT')
      }
      throw new ApiException(error.message, undefined, 'NETWORK_ERROR')
    }

    throw error
  }
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const mergedConfig: RequestConfig = {
    ...config,
    headers: {
      ...defaultHeaders,
      ...config.headers,
    },
  }

  try {
    const response = await fetchWithTimeout(url, mergedConfig)

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`
      let errorData: any

      try {
        errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        // Response is not JSON
        errorMessage = await response.text() || errorMessage
      }

      throw new ApiException(errorMessage, response.status, errorData?.code)
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return await response.text() as T
  } catch (error) {
    if (error instanceof ApiException) {
      throw error
    }

    // TODO: Log error to monitoring service (Sentry, etc.)
    console.error('API Request failed:', error)

    throw new ApiException(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * API Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return apiRequest<T>(endpoint, { ...config, method: 'GET' })
  },

  /**
   * POST request
   */
  post: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * PUT request
   */
  put: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * PATCH request
   */
  patch: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return apiRequest<T>(endpoint, { ...config, method: 'DELETE' })
  },
}

/**
 * API Endpoints
 * Centralized endpoint definitions
 */
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
  },

  // Server Status
  server: {
    status: '/server/status',
    players: '/server/players',
  },

  // User
  user: {
    profile: '/user/profile',
    update: '/user/update',
  },

  // Gallery
  gallery: {
    list: '/gallery',
    upload: '/gallery/upload',
    delete: (id: string) => `/gallery/${id}`,
  },
}

export default api
