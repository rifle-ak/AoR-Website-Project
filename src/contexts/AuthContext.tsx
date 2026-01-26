import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  steamId: string
  displayName: string
  avatarUrl?: string
  isAdmin: boolean
  isVip: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || '/api'

  useEffect(() => {
    // Check for token in URL (from Steam callback)
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (token) {
      localStorage.setItem('auth_token', token)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Load user if we have a token
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      fetchCurrentUser(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchCurrentUser(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Invalid token
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  function login() {
    // Redirect to Steam login
    window.location.href = `${API_URL}/auth/steam`
  }

  async function logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      localStorage.removeItem('auth_token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
