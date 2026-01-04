import { useState, FormEvent, ChangeEvent } from 'react'
import { Eye, EyeOff, User, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  isValidEmail,
  isValidUsername,
  getPasswordStrength,
  ValidationMessages
} from '../utils/validation'
import SEO from '../components/SEO'

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'username':
        if (!value && !isLogin) {
          return ValidationMessages.username.required
        }
        if (value && !isValidUsername(value)) {
          return ValidationMessages.username.invalid
        }
        return undefined

      case 'email':
        if (!value && !isLogin) {
          return ValidationMessages.email.required
        }
        if (value && !isValidEmail(value)) {
          return ValidationMessages.email.invalid
        }
        return undefined

      case 'password':
        if (!value) {
          return ValidationMessages.password.required
        }
        if (!isLogin && value) {
          const strength = getPasswordStrength(value)
          if (strength.score < 3) {
            return ValidationMessages.password.weak
          }
        }
        return undefined

      case 'confirmPassword':
        if (!isLogin && value !== formData.password) {
          return ValidationMessages.password.mismatch
        }
        return undefined

      default:
        return undefined
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!isLogin) {
      newErrors.username = validateField('username', formData.username)
      newErrors.email = validateField('email', formData.email)
      newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword)
    }

    newErrors.password = validateField('password', formData.password)

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== undefined)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    })

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual authentication API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Form submitted:', {
        ...formData,
        password: '[REDACTED]',
        confirmPassword: '[REDACTED]'
      })

      // TODO: Handle successful authentication
      // Example: redirect to dashboard, set auth token, etc.

    } catch (error) {
      console.error('Authentication error:', error)
      setErrors({
        password: 'Authentication failed. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInputClassName = (fieldName: string) => {
    const baseClass = "input-field w-full pl-10"
    const hasError = touched[fieldName] && errors[fieldName]
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName as keyof typeof formData]

    if (hasError) return `${baseClass} border-red-500 focus:ring-red-500`
    if (isValid) return `${baseClass} border-green-500 focus:ring-green-500`
    return baseClass
  }

  const passwordStrength = !isLogin && formData.password
    ? getPasswordStrength(formData.password)
    : null

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500'
    if (score <= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <>
      <SEO
        title={isLogin ? 'Sign In' : 'Create Account'}
        description="Sign in to your Art of Rust account or create a new account to access member features, track your stats, and manage your profile."
      />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-rust-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AOR</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-dark-300">
            {isLogin
              ? 'Welcome back to Art of Rust'
              : 'Join the Art of Rust community'
            }
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-dark-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${getInputClassName('username')} pr-10`}
                    placeholder="Choose a username"
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? 'username-error' : undefined}
                  />
                  {touched.username && !errors.username && formData.username && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
                {touched.username && errors.username && (
                  <p id="username-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${getInputClassName('email')} pr-10`}
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {touched.email && !errors.email && formData.email && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
                {touched.email && errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${getInputClassName('password')} pr-10`}
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : passwordStrength ? 'password-strength' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
              {!isLogin && passwordStrength && !errors.password && (
                <div id="password-strength" className="mt-2">
                  <div className="flex items-center justify-between text-xs text-dark-400 mb-1">
                    <span>Password strength</span>
                    <span className={passwordStrength.score >= 4 ? 'text-green-500' : passwordStrength.score >= 3 ? 'text-yellow-500' : 'text-red-500'}>
                      {passwordStrength.message}
                    </span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${getInputClassName('confirmPassword')} pr-10`}
                    placeholder="Confirm your password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  />
                  {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-rust-500 focus:ring-rust-500 border-dark-600 rounded bg-dark-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: Implement forgot password functionality
                      console.log('Forgot password clicked')
                    }}
                    className="text-rust-500 hover:text-rust-400"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'}</>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setErrors({})
                  setTouched({})
                  setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  })
                }}
                className="text-rust-500 hover:text-rust-400 text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-dark-400">
          <p>
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => console.log('Terms clicked')}
              className="text-rust-500 hover:text-rust-400"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => console.log('Privacy clicked')}
              className="text-rust-500 hover:text-rust-400"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
