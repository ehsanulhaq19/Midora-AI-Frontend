/**
 * Authentication utilities for token management
 */

import { TokenPayload } from '@/api/auth/types'

// Fixed cookie names - not from environment variables
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'midora_access_token',
  REFRESH_TOKEN: 'midora_refresh_token',
  USER_DATA: 'midora_user_data',
} as const

// Token expiration times (in seconds for cookies)
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 15 * 60, // 15 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days
} as const

// Cookie configuration
const COOKIE_CONFIG = {
  path: '/',
  secure: true,
  httpOnly: false, // Set to false for client-side access
  sameSite: 'lax' as const,
} as const

/**
 * Set user data in cookie
 */
export function setUserData(userData: any): void {
  if (typeof document === 'undefined') return

  let cookieString = `${COOKIE_NAMES.USER_DATA}=${encodeURIComponent(JSON.stringify(userData))}`
  cookieString += `; max-age=${TOKEN_EXPIRY.REFRESH_TOKEN}`
  cookieString += `; path=${COOKIE_CONFIG.path}`
  cookieString += `; secure`
  cookieString += `; samesite=${COOKIE_CONFIG.sameSite}`

  document.cookie = cookieString
}

/**
 * Get user data from cookie
 */
export function getUserData(): any | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === COOKIE_NAMES.USER_DATA) {
      try {
        return JSON.parse(decodeURIComponent(cookieValue))
      } catch {
        return null
      }
    }
  }
  return null
}

/**
 * Clear user data cookie
 */
export function clearUserData(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAMES.USER_DATA}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
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
  return Array.from(array, byte => byte.toString(16).slice(-2)).join('')
}

/**
 * Set authentication tokens in cookies
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof document === 'undefined') return

  // Set access token cookie
  let accessTokenCookie = `${COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`
  accessTokenCookie += `; max-age=${TOKEN_EXPIRY.ACCESS_TOKEN}`
  accessTokenCookie += `; path=${COOKIE_CONFIG.path}`
  accessTokenCookie += `; secure`
  accessTokenCookie += `; samesite=${COOKIE_CONFIG.sameSite}`
  document.cookie = accessTokenCookie

  // Set refresh token cookie
  let refreshTokenCookie = `${COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}`
  refreshTokenCookie += `; max-age=${TOKEN_EXPIRY.REFRESH_TOKEN}`
  refreshTokenCookie += `; path=${COOKIE_CONFIG.path}`
  refreshTokenCookie += `; secure`
  refreshTokenCookie += `; samesite=${COOKIE_CONFIG.sameSite}`
  document.cookie = refreshTokenCookie
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies(): void {
  if (typeof document === 'undefined') return

  // Clear access token cookie
  document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  
  // Clear refresh token cookie
  document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  
  // Clear user data cookie
  clearUserData()
}
