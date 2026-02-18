/**
 * Cookie utility functions for managing refresh tokens only
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

  // Validate the cookie value
  const encodedValue = encodeURIComponent(value)
  
  // Check for problematic characters
  const problematicChars = /[;,\s]/
  if (problematicChars.test(value)) {
    // Cookie value contains potentially problematic characters
  }
  
  let cookieString = `${name}=${encodedValue}`

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
  
  // Set the cookie
  try {
    document.cookie = cookieString
  } catch (error) {
    // Error setting cookie
  }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  // Parse cookies more robustly
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim()
    if (trimmedCookie.startsWith(`${name}=`)) {
      const cookieValue = trimmedCookie.substring(name.length + 1)
      const result = decodeURIComponent(cookieValue)
      return result
    }
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
 * Test cookie functionality - can be called from browser console
 */
export function testCookieFunctionality(): void {
  // Test 1: Simple cookie
  setCookie('test_simple', 'simple_value')
  
  // Test 2: Complex cookie with JWT-like value
  const jwtLikeValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzYwNTc4ODQwfQ.test'
  setCookie('test_complex', jwtLikeValue)
  
  // Test 3: Test with the actual refresh token format
  const actualRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlaHNhbnVsaGFxMDQyQGdtYWlsLmNvbSIsImV4cCI6MTc2MDU3ODg0M30.yo2hvOdJFOMi7VI8DzzA6QfvKe2o695JROIl9f5V6Vw'
  setCookie('test_refresh_token', actualRefreshToken)
  
  // Test 4: Test with a shorter version
  const shortToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzYwNTc4ODQwfQ.test'
  setCookie('test_short_token', shortToken)
  
  // Test 4: Check document.cookie
  setTimeout(() => {
    getCookie('test_simple')
    getCookie('test_complex')
    getCookie('test_refresh_token')
  }, 500)
}
