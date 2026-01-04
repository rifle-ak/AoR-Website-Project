import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../test/test-utils'
import { copyToClipboard } from './clipboard'

describe('clipboard utilities', () => {
  describe('copyToClipboard', () => {
    it('should successfully copy text to clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      })

      const result = await copyToClipboard('test text')

      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith('test text')
    })

    it('should return false when clipboard API fails', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Failed'))
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      })

      const result = await copyToClipboard('test text')

      expect(result).toBe(false)
    })

    it('should use fallback when clipboard API is not available', async () => {
      const originalClipboard = navigator.clipboard
      // @ts-ignore
      delete navigator.clipboard

      document.execCommand = vi.fn().mockReturnValue(true)

      const result = await copyToClipboard('test text')

      expect(result).toBe(true)

      // Restore
      Object.assign(navigator, { clipboard: originalClipboard })
    })
  })
})
