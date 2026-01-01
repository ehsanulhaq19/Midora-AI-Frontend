'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { getCurrentLanguage as getI18nLanguage, setCurrentLanguage as setI18nLanguage, type SupportedLanguage, t as i18nT } from '@/i18n'
import { getLanguageCodeFromName } from '@/lib/language-constants'

interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  loadLanguageFromUser: (userLanguage: string | null | undefined) => void
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: SupportedLanguage
}

const LANGUAGE_STORAGE_KEY = 'midora-language'

export function LanguageProvider({ children, defaultLanguage = 'en' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get language from localStorage or default
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh' || savedLanguage === 'de' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage)
      setI18nLanguage(savedLanguage)
    } else {
      setLanguageState(defaultLanguage)
      setI18nLanguage(defaultLanguage)
    }
  }, [defaultLanguage])

  const setLanguage = useCallback((newLanguage: SupportedLanguage) => {
    if (newLanguage === 'en' || newLanguage === 'zh' || newLanguage === 'de' || newLanguage === 'ar') {
      // Update module-level state first
      setI18nLanguage(newLanguage)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
      
      // Update React state - this will trigger re-renders in all components using useLanguage/useTranslation
      setLanguageState(newLanguage)
      
      // Trigger a custom event to notify other components (for components not using context)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: newLanguage } }))
      }
    }
  }, [])

  /**
   * Load language from user data (from backend API)
   * Converts full language name to language code and sets it
   * @param userLanguage - Full language name from user data (e.g., "English", "Chinese")
   */
  const loadLanguageFromUser = useCallback((userLanguage: string | null | undefined) => {
    if (!userLanguage) {
      return
    }

    const languageCode = getLanguageCodeFromName(userLanguage)
    
    // Only update if the language is different from current
    if (languageCode !== language) {
      setLanguage(languageCode)
    }
  }, [language, setLanguage])

  // Memoize context value to ensure React detects changes properly
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    loadLanguageFromUser,
    mounted
  }), [language, setLanguage, loadLanguageFromUser, mounted])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

/**
 * Hook for translations that automatically re-renders when language changes
 * Components using this hook will automatically re-render when language changes
 * because the language value from context changes, triggering React re-renders
 */
export function useTranslation() {
  const { language } = useLanguage()
  
  // Don't memoize the t function - create a new one on each render
  // This ensures components re-render when language changes
  // The function reads from the updated module-level state
  const t = (key: string): string => {
    // Read from module-level state (which is updated by setLanguage)
    return i18nT(key)
  }
  
  return { t, language }
}

