'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { getCurrentLanguage as getI18nLanguage, setCurrentLanguage as setI18nLanguage, type SupportedLanguage, t as i18nT } from '@/i18n'

interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
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

  // Memoize context value to ensure React detects changes properly
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    mounted
  }), [language, setLanguage, mounted])

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
  
  // The t function reads from the updated module-level state
  // When language changes in context, this component re-renders automatically
  // We include language in the dependency to ensure the function reference updates
  const t = useCallback((key: string): string => {
    // Read from module-level state (which is updated by setLanguage)
    return i18nT(key)
  }, [language]) // When language changes, this callback is recreated, ensuring fresh reads
  
  return { t, language }
}

