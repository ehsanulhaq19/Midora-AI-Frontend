/**
 * Internationalization (i18n) main configuration
 * Centralized i18n management with modular language files
 */

import { appConfig } from '@/config/app'

export type SupportedLanguage = 'en' | 'zh' | 'de' | 'ar'

const LANGUAGE_STORAGE_KEY = 'midora-language'

// Import language modules
import { enTranslations } from './languages/en'
import { zhTranslations } from './languages/zh'
import { deTranslations } from './languages/de'
import { arTranslations } from './languages/ar'

// Translation storage
const translations: Record<SupportedLanguage, any> = {
  en: enTranslations,
  zh: zhTranslations,
  de: deTranslations,
  ar: arTranslations,
}

/**
 * Get language from localStorage or default
 */
function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return appConfig.ui.defaultLanguage as SupportedLanguage
  }
  
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored && (stored === 'en' || stored === 'zh' || stored === 'de' || stored === 'ar')) {
    return stored as SupportedLanguage
  }
  
  return appConfig.ui.defaultLanguage as SupportedLanguage
}

// Current language state - initialize from localStorage
let currentLanguage: SupportedLanguage = getStoredLanguage()

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLanguage {
  return currentLanguage
}

/**
 * Set current language and save to localStorage
 */
export function setCurrentLanguage(language: SupportedLanguage): void {
  if (language === 'en' || language === 'zh' || language === 'de' || language === 'ar') {
    currentLanguage = language
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    }
  }
}

/**
 * Get translation for a key
 */
export function t(key: string): string {
  const keys = key.split('.')
  let value: any = translations[currentLanguage]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}

/**
 * Get translation array for a key
 */
export function tArray(key: string): string[] {
  const keys = key.split('.')
  let value: any = translations[currentLanguage]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return []
    }
  }
  
  return Array.isArray(value) ? value : []
}

/**
 * Get translation with parameters
 */
export function tWithParams(key: string, params: Record<string, string | number>): string {
  let translation = t(key)
  
  Object.entries(params).forEach(([param, value]) => {
    translation = translation.replace(`{${param}}`, String(value))
  })
  
  return translation
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(key: string): boolean {
  const keys = key.split('.')
  let value: any = translations[currentLanguage]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return false
    }
  }
  
  return typeof value === 'string'
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): SupportedLanguage[] {
  return appConfig.ui.supportedLanguages as SupportedLanguage[]
}

/**
 * Initialize i18n
 */
export function initializeI18n(): void {
  // Set initial language from localStorage or config
  currentLanguage = getStoredLanguage()
}

// Export the translation function as default
export default t
