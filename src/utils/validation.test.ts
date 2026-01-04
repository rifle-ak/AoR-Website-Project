import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidUsername,
  getPasswordStrength,
  isStrongPassword,
} from './validation'

describe('validation utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('missing@domain')).toBe(false)
      expect(isValidEmail('@nodomain.com')).toBe(false)
      expect(isValidEmail('spaces in@email.com')).toBe(false)
    })
  })

  describe('isValidUsername', () => {
    it('should validate correct usernames', () => {
      expect(isValidUsername('user123')).toBe(true)
      expect(isValidUsername('User_Name')).toBe(true)
      expect(isValidUsername('abc')).toBe(true) // minimum 3 chars
    })

    it('should reject invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false) // too short
      expect(isValidUsername('a'.repeat(21))).toBe(false) // too long
      expect(isValidUsername('user-name')).toBe(false) // contains dash
      expect(isValidUsername('user name')).toBe(false) // contains space
      expect(isValidUsername('user@name')).toBe(false) // contains @
    })
  })

  describe('getPasswordStrength', () => {
    it('should rate weak passwords correctly', () => {
      const result = getPasswordStrength('abc')
      expect(result.score).toBeLessThanOrEqual(2)
      expect(result.message).toMatch(/weak/i)
    })

    it('should rate medium passwords correctly', () => {
      const result = getPasswordStrength('Password1')
      expect(result.score).toBeGreaterThanOrEqual(3)
      expect(result.score).toBeLessThanOrEqual(4)
    })

    it('should rate strong passwords correctly', () => {
      const result = getPasswordStrength('MyP@ssw0rd123!')
      expect(result.score).toBeGreaterThanOrEqual(5)
      expect(result.message).toMatch(/strong/i)
    })
  })

  describe('isStrongPassword', () => {
    it('should accept strong passwords', () => {
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true)
      expect(isStrongPassword('SecurePass123')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(isStrongPassword('short')).toBe(false) // too short
      expect(isStrongPassword('alllowercase123')).toBe(false) // no uppercase
      expect(isStrongPassword('ALLUPPERCASE123')).toBe(false) // no lowercase
      expect(isStrongPassword('NoNumbers')).toBe(false) // no numbers
    })
  })
})
