/**
 * Authentication utilities for token management and cookies
 */

import { CookieConfig, TokenPayload } from '@/api/auth/types'

// Fixed cookie names - not from environment variables
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'midora_access_token',
  REFRESH_TOKEN: 'midora_refresh_token',
  USER_DATA: 'midora_user_data',
} as const

// Token expiration times (in days for cookies)
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 1, // 1 day
  REFRESH_TOKEN: 7, // 7 days
} as const

// Cookie configuration
const COOKIE_CONFIG = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false, // Set to false for client-side access
  sameSite: 'lax' as const,
} as const

/**
 * Set a cookie with the given configuration
 */
export function setCookie(config: CookieConfig): void {
  if (typeof document === 'undefined') return

  let cookieString = `${config.name}=${encodeURIComponent(config.value)}`

  if (config.maxAge) {
    cookieString += `; max-age=${config.maxAge}`
  }

  if (config.path) {
    cookieString += `; path=${config.path}`
  }

  if (config.domain) {
    cookieString += `; domain=${config.domain}`
  }

  if (config.secure) {
    cookieString += `; secure`
  }

  if (config.httpOnly) {
    cookieString += `; httponly`
  }

  if (config.sameSite) {
    cookieString += `; samesite=${config.sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue)
    }
  }
  return null
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
}

/**
 * Set access token in cookie
 */
export function setAccessToken(token: string): void {
  setCookie({
    name: COOKIE_NAMES.ACCESS_TOKEN,
    value: token,
    maxAge: TOKEN_EXPIRY.ACCESS_TOKEN,
    ...COOKIE_CONFIG,
  })
}

/**
 * Set refresh token in cookie
 */
export function setRefreshToken(token: string): void {
  setCookie({
    name: COOKIE_NAMES.REFRESH_TOKEN,
    value: token,
    maxAge: TOKEN_EXPIRY.REFRESH_TOKEN,
    ...COOKIE_CONFIG,
  })
}

/**
 * Set both access and refresh tokens
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  console.log('Setting tokens in cookies...')
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
  console.log('Tokens set successfully')
}

/**
 * Get access token from cookie
 */
export function getAccessToken(): string | null {
  return getCookie(COOKIE_NAMES.ACCESS_TOKEN)
}

/**
 * Get refresh token from cookie
 */
export function getRefreshToken(): string | null {
  return getCookie(COOKIE_NAMES.REFRESH_TOKEN)
}


/**
 * Set user data in cookie
 */
export function setUserData(userData: any): void {
  setCookie({
    name: COOKIE_NAMES.USER_DATA,
    value: JSON.stringify(userData),
    maxAge: TOKEN_EXPIRY.REFRESH_TOKEN, // Same as refresh token
    ...COOKIE_CONFIG,
  })
}

/**
 * Get user data from cookie
 */
export function getUserData(): any | null {
  const userData = getCookie(COOKIE_NAMES.USER_DATA)
  if (!userData) return null

  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies(): void {
  removeCookie(COOKIE_NAMES.ACCESS_TOKEN)
  removeCookie(COOKIE_NAMES.REFRESH_TOKEN)
  removeCookie(COOKIE_NAMES.USER_DATA)
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJwtPayload(token)
    if (!payload || !payload.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch {
    return true
  }
}

/**
 * Parse JWT payload without verification
 */
export function parseJwtPayload(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = parseJwtPayload(token)
  if (!payload || !payload.exp) return null

  return payload.exp * 1000
}

/**
 * Check if access token needs refresh (expires in next 5 minutes)
 */
export function shouldRefreshToken(token: string): boolean {
  try {
    const payload = parseJwtPayload(token)
    if (!payload || !payload.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    const fiveMinutes = 5 * 60

    return payload.exp - currentTime < fiveMinutes
  } catch {
    return true
  }
}

/**
 * Get authorization header value
 */
export function getAuthHeader(): string | null {
  const token = getAccessToken()
  return token ? `Bearer ${token}` : null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()

  if (!accessToken || !refreshToken) return false

  // If access token is expired but refresh token exists, user is still authenticated
  // The app should attempt to refresh the access token
  if (isTokenExpired(accessToken)) {
    return !isTokenExpired(refreshToken)
  }

  return true
}

/**
 * Get user ID from token
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = parseJwtPayload(token)
  return payload?.sub || null
}

/**
 * Get user email from token
 */
export function getUserEmailFromToken(token: string): string | null {
  const payload = parseJwtPayload(token)
  return payload?.email || null
}

/**
 * Format token for display (show first and last few characters)
 */
export function formatTokenForDisplay(token: string): string {
  if (token.length <= 20) return token
  return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`
}

/**
 * Validate token format (basic JWT structure check)
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false
  
  const parts = token.split('.')
  return parts.length === 3
}

/**
 * Create a secure random string for CSRF protection
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Store CSRF token in cookie
 */
export function setCSRFToken(token: string): void {
  setCookie({
    name: 'midora_csrf_token',
    value: token,
    maxAge: 60 * 60, // 1 hour
    ...COOKIE_CONFIG,
  })
}

/**
 * Get CSRF token from cookie
 */
export function getCSRFToken(): string | null {
  return getCookie('midora_csrf_token')
}

/**
 * Clear CSRF token
 */
export function clearCSRFToken(): void {
  removeCookie('midora_csrf_token')
}
