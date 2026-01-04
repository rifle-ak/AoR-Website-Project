/**
 * Safely copy text to clipboard with error handling
 * @param text Text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    }

    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Read text from clipboard
 * @returns Promise that resolves to clipboard text or null if failed
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (!navigator.clipboard) {
      return null
    }

    const text = await navigator.clipboard.readText()
    return text
  } catch (error) {
    console.error('Failed to read from clipboard:', error)
    return null
  }
}
