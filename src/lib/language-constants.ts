/**
 * Language constants and mappings
 * Defines supported languages with their codes, full names, and native labels
 */

import { SupportedLanguage } from '@/i18n'

/**
 * Language information interface
 */
export interface LanguageInfo {
  value: SupportedLanguage
  label: string // Native name
  fullName: string // English name
}

/**
 * Supported languages configuration
 */
export const LANGUAGES: LanguageInfo[] = [
  { value: 'en', label: 'English', fullName: 'English' },
  { value: 'zh', label: '中文', fullName: 'Chinese' },
  { value: 'de', label: 'Deutsch', fullName: 'German' },
  { value: 'ar', label: 'العربية', fullName: 'Arabic' },
]

/**
 * Map of full language names to language codes
 * Used to convert backend language names to frontend language codes
 */
export const LANGUAGE_NAME_TO_CODE: Record<string, SupportedLanguage> = {
  'English': 'en',
  'Chinese': 'zh',
  'German': 'de',
  'Arabic': 'ar',
}

/**
 * Map of language codes to full language names
 * Used to convert frontend language codes to backend language names
 */
export const LANGUAGE_CODE_TO_NAME: Record<SupportedLanguage, string> = {
  'en': 'English',
  'zh': 'Chinese',
  'de': 'German',
  'ar': 'Arabic',
}

/**
 * Get language code from full language name
 * @param languageName - Full language name (e.g., "English", "Chinese")
 * @returns Language code or 'en' as default
 */
export function getLanguageCodeFromName(languageName: string | null | undefined): SupportedLanguage {
  if (!languageName) {
    return 'en'
  }
  
  return LANGUAGE_NAME_TO_CODE[languageName] || 'en'
}

/**
 * Get full language name from language code
 * @param languageCode - Language code (e.g., "en", "zh")
 * @returns Full language name or "English" as default
 */
export function getLanguageNameFromCode(languageCode: SupportedLanguage): string {
  return LANGUAGE_CODE_TO_NAME[languageCode] || 'English'
}

/**
 * Get language info by code
 * @param languageCode - Language code
 * @returns Language info or English as default
 */
export function getLanguageInfo(languageCode: SupportedLanguage): LanguageInfo {
  return LANGUAGES.find(lang => lang.value === languageCode) || LANGUAGES[0]
}

/**
 * Get language info by full name
 * @param languageName - Full language name
 * @returns Language info or English as default
 */
export function getLanguageInfoByName(languageName: string | null | undefined): LanguageInfo {
  const code = getLanguageCodeFromName(languageName)
  return getLanguageInfo(code)
}

