/**
 * Token Manager
 * Handles secure storage and retrieval of access and refresh tokens
 * Uses hybrid approach: access tokens in localStorage, refresh tokens in cookies
 */

import { setCookie, getCookie, removeCookie } from './cookies'
import { appConfig } from '../config/app'

interface TokenStorage {
  accessToken: string | null
  refreshToken: string | null
  authMethod: string | null
}

class TokenManager {
  private readonly ACCESS_TOKEN_COOKIE = 'access_token'
  private readonly REFRESH_TOKEN_COOKIE = 'refresh_token'
  private readonly AUTH_METHOD_KEY = 'auth_method'

  /**
   * Store tokens in cookies with environment-based expiry
   */
  storeTokens(accessToken: string, refreshToken: string, authMethod: string): void {
    
    // Get expiry durations from app config
    const accessTokenExpiry = appConfig.auth.accessTokenExpiry
    const refreshTokenExpiry = appConfig.auth.refreshTokenExpiry
    
    // Determine if we're in a secure environment
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    
    // Store access token in cookie
    setCookie(this.ACCESS_TOKEN_COOKIE, accessToken, {
      maxAge: accessTokenExpiry,
      secure: isSecure,
      sameSite: 'lax',
      httpOnly: false
    })
    
    // Store refresh token in cookie
    setCookie(this.REFRESH_TOKEN_COOKIE, refreshToken, {
      maxAge: refreshTokenExpiry,
      secure: isSecure,
      sameSite: 'lax',
      httpOnly: false
    })
    
    // Store auth method in localStorage (not sensitive)
    localStorage.setItem(this.AUTH_METHOD_KEY, authMethod)
    
  }

  /**
   * Get access token from cookie
   */
  getAccessToken(): string | null {
    const accessToken = getCookie(this.ACCESS_TOKEN_COOKIE)
    return accessToken
  }

  /**
   * Get refresh token from cookie
   */
  getRefreshToken(): string | null {
    const refreshToken = getCookie(this.REFRESH_TOKEN_COOKIE)
    return refreshToken
  }

  /**
   * Get authentication method
   */
  getAuthMethod(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.AUTH_METHOD_KEY)
  }

  /**
   * Get all stored tokens
   */
  getTokens(): TokenStorage {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      authMethod: this.getAuthMethod()
    }
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    removeCookie(this.ACCESS_TOKEN_COOKIE)
    removeCookie(this.REFRESH_TOKEN_COOKIE)
    localStorage.removeItem(this.AUTH_METHOD_KEY)
    sessionStorage.removeItem('sso_state')
  }

  /**
   * Check if user has valid tokens
   */
  hasValidTokens(): boolean {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    return !!(accessToken && refreshToken)
  }

  /**
   * Update access token (after refresh)
   */
  updateAccessToken(accessToken: string): void {
    const accessTokenExpiry = appConfig.auth.accessTokenExpiry
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    
    setCookie(this.ACCESS_TOKEN_COOKIE, accessToken, {
      maxAge: accessTokenExpiry,
      secure: isSecure,
      sameSite: 'lax',
      httpOnly: false
    })
  }

  /**
   * Update refresh token in cookie
   */
  updateRefreshToken(refreshToken: string): void {
    const refreshTokenExpiry = appConfig.auth.refreshTokenExpiry
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    
    setCookie(this.REFRESH_TOKEN_COOKIE, refreshToken, {
      maxAge: refreshTokenExpiry,
      secure: isSecure,
      sameSite: 'lax',
      httpOnly: false
    })
  }

  /**
   * Check if access token is expired (basic check)
   */
  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken()
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch {
      return true
    }
  }

  /**
   * Debug method to check token state
   */
  debugTokenState(): void {
    // Debug method - console statements removed for production
  }
}

// Export singleton instance
export const tokenManager = new TokenManager()

// Export the class for testing
export { TokenManager }
