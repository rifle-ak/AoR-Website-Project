/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Password strength validation
 * At least 8 characters, one uppercase, one lowercase, one number
 */
export function isStrongPassword(password: string): boolean {
  const minLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return minLength && hasUpperCase && hasLowerCase && hasNumber
}

/**
 * Get password strength description
 */
export function getPasswordStrength(password: string): {
  score: number
  message: string
} {
  let score = 0
  let message = 'Very Weak'

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) message = 'Weak'
  else if (score <= 4) message = 'Medium'
  else if (score <= 5) message = 'Strong'
  else message = 'Very Strong'

  return { score, message }
}

/**
 * Username validation
 * 3-20 characters, alphanumeric and underscores only
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

/**
 * Validation error messages
 */
export const ValidationMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    weak: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
    mismatch: 'Passwords do not match'
  },
  username: {
    required: 'Username is required',
    invalid: 'Username must be 3-20 characters, alphanumeric and underscores only'
  }
}
