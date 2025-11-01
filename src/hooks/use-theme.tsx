'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

const THEME_STORAGE_KEY = 'midora-theme'

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme)
    } else {
      setThemeState(defaultTheme)
    }
  }, [defaultTheme])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    // Set data-theme attribute for CSS variables
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
    
    // Save theme preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="app-bg-primary app-text-primary">{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utility functions for theme management
export const getCurrentTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme
  if (stored && (stored === 'light' || stored === 'dark')) {
    return stored
  }
  
  return 'light'
}

export const setTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  
  const root = document.documentElement
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
  }
}

export const toggleTheme = (): Theme => {
  const currentTheme = getCurrentTheme()
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
  return newTheme
}

export const initializeTheme = (): void => {
  if (typeof window === 'undefined') return
  
  const theme = getCurrentTheme()
  setTheme(theme)
}




