/**
 * Internationalization (i18n) main configuration
 * Centralized i18n management with modular language files
 */

import { appConfig } from '@/config/app'

export type SupportedLanguage = 'en'

// Import language modules
import { enTranslations } from './languages/en'

// Translation storage
const translations: Record<SupportedLanguage, any> = {
  en: enTranslations,
}

// Current language state
let currentLanguage: SupportedLanguage = appConfig.ui.defaultLanguage as SupportedLanguage

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLanguage {
  return currentLanguage
}

/**
 * Set current language
 */
export function setCurrentLanguage(language: SupportedLanguage): void {
  if (appConfig.ui.supportedLanguages.includes(language)) {
    currentLanguage = language
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
  // Set initial language from config
  currentLanguage = appConfig.ui.defaultLanguage as SupportedLanguage
  
  // You can add logic here to detect user's preferred language
  // from browser settings, localStorage, etc.
}

// Export the translation function as default
export default t
