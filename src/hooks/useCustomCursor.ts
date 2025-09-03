import { useState, useEffect } from 'react'
import { theme } from '@/lib/theme'

export function useCustomCursor() {
  const [isEnabled, setIsEnabled] = useState(theme.cursor.enabled)

  // Load cursor preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('midora-custom-cursor-enabled')
    if (savedPreference !== null) {
      setIsEnabled(JSON.parse(savedPreference))
    }
  }, [])

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('midora-custom-cursor-enabled', JSON.stringify(isEnabled))
  }, [isEnabled])

  const enable = () => setIsEnabled(true)
  const disable = () => setIsEnabled(false)
  const toggle = () => setIsEnabled(prev => !prev)

  return {
    isEnabled,
    enable,
    disable,
    toggle,
  }
}
