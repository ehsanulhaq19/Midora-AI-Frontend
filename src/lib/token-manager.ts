/**
 * Token Manager
 * Handles secure storage and retrieval of access and refresh tokens
 * Uses hybrid approach: access tokens in localStorage, refresh tokens in HttpOnly cookies
 */

interface TokenStorage {
  accessToken: string | null
  refreshToken: string | null
  authMethod: string | null
}

class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'access_token'
  private readonly AUTH_METHOD_KEY = 'auth_method'
  private readonly REFRESH_TOKEN_COOKIE = 'refresh_token'

  /**
   * Store tokens using hybrid approach
   * Access token in localStorage, refresh token in HttpOnly cookie
   */
  storeTokens(accessToken: string, refreshToken: string, authMethod: string): void {
    // Store access token in localStorage (short-lived)
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.AUTH_METHOD_KEY, authMethod)
    
    // Store refresh token in HttpOnly cookie (handled by backend)
    // The backend should set the refresh token cookie with these attributes:
    // - HttpOnly: true (prevents XSS)
    // - Secure: true (HTTPS only)
    // - SameSite: 'strict' (prevents CSRF)
    // - Max-Age: 7 days (or your preferred expiration)
    
    // For now, we'll also store in localStorage as fallback
    // In production, remove this line and let backend handle cookies
    localStorage.setItem(this.REFRESH_TOKEN_COOKIE, refreshToken)
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  /**
   * Get refresh token from localStorage (fallback)
   * In production, this should be handled by HttpOnly cookies
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.REFRESH_TOKEN_COOKIE)
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
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_COOKIE)
    localStorage.removeItem(this.AUTH_METHOD_KEY)
    
    // Clear sessionStorage as well
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
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
  }

  /**
   * Check if access token is expired (basic check)
   * Note: This is a simple implementation. In production, you might want
   * to decode the JWT and check the exp claim
   * 
   * Since backend handles token refresh, this is mainly for debugging
   */
  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken()
    if (!token) return true

    try {
      // Decode JWT payload (without verification)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch {
      // If we can't decode the token, assume it's expired
      return true
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager()

// Export the class for testing
export { TokenManager }
