/**
 * Application configuration
 * Centralized configuration management for the entire application
 */

export interface AppConfig {
  // Backend API configuration
  backendUrl: string
  apiTimeout: number
  
  // Application settings
  appName: string
  appVersion: string
  environment: 'development' | 'production' | 'test'
  
  // Authentication settings
  auth: {
    accessTokenExpiry: number
  }
  
  // Feature flags
  features: {
    enableGoogleAuth: boolean
    enableTwoFactor: boolean
    enableAnalytics: boolean
  }
  
  // UI settings
  ui: {
    defaultLanguage: string
    supportedLanguages: string[]
    theme: 'light' | 'dark' | 'system'
  }
}

/**
 * Get application configuration from environment variables
 */
function getAppConfig(): AppConfig {
  return {
    // Backend API configuration
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    
    // Application settings
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Midora AI',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
    
    // Authentication settings
    auth: {
      accessTokenExpiry: parseInt(process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY || '900'), // 15 minutes
    },
    
    // Feature flags
    features: {
      enableGoogleAuth: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true',
      enableTwoFactor: process.env.NEXT_PUBLIC_ENABLE_TWO_FACTOR === 'true',
      enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    },
    
    // UI settings
    ui: {
      defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
      supportedLanguages: (process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || 'en').split(','),
      theme: (process.env.NEXT_PUBLIC_DEFAULT_THEME as AppConfig['ui']['theme']) || 'system',
    },
  }
}

// Export the configuration
export const appConfig = getAppConfig()

// Export individual config sections for convenience
export const apiConfig = {
  baseUrl: appConfig.backendUrl,
  timeout: appConfig.apiTimeout,
}

export const authConfig = appConfig.auth

export const featureFlags = appConfig.features

export const uiConfig = appConfig.ui

// Validation function to check if all required environment variables are set
export function validateConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_BACKEND_URL',
  ]
  
  const missingVars: string[] = []
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  })
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}

// Helper function to get environment-specific configuration
export function getEnvironmentConfig() {
  return {
    isDevelopment: appConfig.environment === 'development',
    isProduction: appConfig.environment === 'production',
    isTest: appConfig.environment === 'test',
  }
}
