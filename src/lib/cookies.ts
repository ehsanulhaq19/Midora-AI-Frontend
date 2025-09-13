/**
 * Cookie utility functions for managing authentication tokens
 */

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: Date
    maxAge?: number
    path?: string
    domain?: string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}
): void {
  if (typeof document === 'undefined') return

  const {
    expires,
    maxAge = 7 * 24 * 60 * 60, // 7 days default
    path = '/',
    domain,
    secure = true,
    httpOnly = false,
    sameSite = 'lax'
  } = options

  let cookieString = `${name}=${encodeURIComponent(value)}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  } else if (maxAge) {
    cookieString += `; max-age=${maxAge}`
  }

  cookieString += `; path=${path}`

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += '; secure'
  }

  if (httpOnly) {
    cookieString += '; httponly'
  }

  cookieString += `; samesite=${sameSite}`

  document.cookie = cookieString
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  
  return null
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
}

/**
 * Set authentication tokens
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  setCookie('access_token', accessToken, {
    maxAge: 15 * 60, // 15 minutes
    secure: true,
    sameSite: 'lax'
  })
  
  setCookie('refresh_token', refreshToken, {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: true,
    sameSite: 'lax'
  })
}

/**
 * Get authentication tokens
 */
export function getAuthTokens(): { accessToken: string | null; refreshToken: string | null } {
  return {
    accessToken: getCookie('access_token'),
    refreshToken: getCookie('refresh_token')
  }
}

/**
 * Clear authentication tokens
 */
export function clearAuthTokens(): void {
  removeCookie('access_token')
  removeCookie('refresh_token')
}
