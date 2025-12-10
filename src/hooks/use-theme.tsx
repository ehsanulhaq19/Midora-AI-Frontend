'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
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

// Get system theme preference
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Get resolved theme (actual theme to apply)
const getResolvedTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getResolvedTheme(defaultTheme))

  useEffect(() => {
    setMounted(true)
    
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      setThemeState(savedTheme)
      setResolvedTheme(getResolvedTheme(savedTheme))
    } else {
      setThemeState(defaultTheme)
      setResolvedTheme(getResolvedTheme(defaultTheme))
    }
  }, [defaultTheme])

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (!mounted || theme !== 'system') return

    // Immediately detect and apply system theme when switching to 'system'
    const systemTheme = getSystemTheme()
    setResolvedTheme(systemTheme)
    
    // Apply to DOM immediately
    const root = window.document.documentElement
    if (systemTheme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }

    // Set up listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const newSystemTheme = getSystemTheme()
      console.log('[Theme] System theme changed, updating to:', newSystemTheme)
      setResolvedTheme(newSystemTheme)
      
      // Apply to DOM immediately when system theme changes
      const root = window.document.documentElement
      root.classList.add('theme-transitioning')
      
      if (newSystemTheme === 'dark') {
        root.setAttribute('data-theme', 'dark')
      } else {
        root.removeAttribute('data-theme')
      }
      
      requestAnimationFrame(() => {
        root.classList.remove('theme-transitioning')
      })
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return

    const resolved = getResolvedTheme(theme)
    setResolvedTheme(resolved)

    const root = window.document.documentElement
    
    // Temporarily disable transitions for instant theme switching
    root.classList.add('theme-transitioning')
    // Set data-theme attribute for CSS variables
    if (resolved === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
    
    // Save theme preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    
    // Re-enable transitions after theme change (for hover effects, etc.)
    requestAnimationFrame(() => {
      root.classList.remove('theme-transitioning')
    })
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'light') return 'dark'
      if (prevTheme === 'dark') return 'system'
      return 'light'
    })
  }

  // Always provide the context, even before mounted, to prevent useTheme errors
  // The mounted state can be used by consumers to know when theme is fully initialized
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, mounted }}>
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
  if (typeof window === 'undefined') return 'system'
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme
  if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
    return stored
  }
  
  return 'system'
}

export const setTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  
  const resolved = getResolvedTheme(theme)
  const root = document.documentElement
  if (resolved === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
  }
}

export const toggleTheme = (): Theme => {
  const currentTheme = getCurrentTheme()
  let newTheme: Theme
  if (currentTheme === 'light') {
    newTheme = 'dark'
  } else if (currentTheme === 'dark') {
    newTheme = 'system'
  } else {
    newTheme = 'light'
  }
  setTheme(newTheme)
  return newTheme
}

export const initializeTheme = (): void => {
  if (typeof window === 'undefined') return
  
  const theme = getCurrentTheme()
  setTheme(theme)
}

// Reset theme to system (used on logout)
export const resetThemeToSystem = (): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_STORAGE_KEY, 'system')
  const resolved = getSystemTheme()
  const root = document.documentElement
  if (resolved === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
  }
}




