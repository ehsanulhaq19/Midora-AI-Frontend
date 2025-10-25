/**
 * Tests for Token Manager
 * Verifies refresh token cookie functionality
 */

import { tokenManager, TokenManager } from '@/lib/token-manager'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
})

describe('TokenManager', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()
    document.cookie = ''
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('storeTokens', () => {
    it('should store access token in localStorage and refresh token in cookie', () => {
      const accessToken = 'test-access-token'
      const refreshToken = 'test-refresh-token'
      const authMethod = 'email'

      tokenManager.storeTokens(accessToken, refreshToken, authMethod)

      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', accessToken)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_method', authMethod)
      
      // Check that refresh token cookie is set
      const refreshTokenCookie = getCookie('refresh_token')
      expect(refreshTokenCookie).toBe(refreshToken)
    })
  })

  describe('getAccessToken', () => {
    it('should return access token from localStorage', () => {
      const accessToken = 'test-access-token'
      localStorageMock.getItem.mockReturnValue(accessToken)

      const result = tokenManager.getAccessToken()

      expect(result).toBe(accessToken)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('access_token')
    })

    it('should return null when no access token exists', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = tokenManager.getAccessToken()

      expect(result).toBeNull()
    })
  })

  describe('getRefreshToken', () => {
    it('should return refresh token from cookie', () => {
      const refreshToken = 'test-refresh-token'
      setCookie('refresh_token', refreshToken)

      const result = tokenManager.getRefreshToken()

      expect(result).toBe(refreshToken)
    })

    it('should return null when no refresh token cookie exists', () => {
      const result = tokenManager.getRefreshToken()

      expect(result).toBeNull()
    })
  })

  describe('getTokens', () => {
    it('should return all stored tokens', () => {
      const accessToken = 'test-access-token'
      const refreshToken = 'test-refresh-token'
      const authMethod = 'email'

      localStorageMock.getItem.mockImplementation((key) => {
        switch (key) {
          case 'access_token':
            return accessToken
          case 'auth_method':
            return authMethod
          default:
            return null
        }
      })
      setCookie('refresh_token', refreshToken)

      const result = tokenManager.getTokens()

      expect(result).toEqual({
        accessToken,
        refreshToken,
        authMethod,
      })
    })
  })

  describe('clearTokens', () => {
    it('should clear all tokens and cookies', () => {
      // Set up some tokens
      localStorageMock.getItem.mockReturnValue('test-token')
      setCookie('refresh_token', 'test-refresh-token')

      tokenManager.clearTokens()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_method')
      
      // Check that refresh token cookie is cleared
      const refreshTokenCookie = getCookie('refresh_token')
      expect(refreshTokenCookie).toBeNull()
    })
  })

  describe('hasValidTokens', () => {
    it('should return true when both tokens exist', () => {
      localStorageMock.getItem.mockReturnValue('test-access-token')
      setCookie('refresh_token', 'test-refresh-token')

      const result = tokenManager.hasValidTokens()

      expect(result).toBe(true)
    })

    it('should return false when access token is missing', () => {
      localStorageMock.getItem.mockReturnValue(null)
      setCookie('refresh_token', 'test-refresh-token')

      const result = tokenManager.hasValidTokens()

      expect(result).toBe(false)
    })

    it('should return false when refresh token is missing', () => {
      localStorageMock.getItem.mockReturnValue('test-access-token')

      const result = tokenManager.hasValidTokens()

      expect(result).toBe(false)
    })
  })

  describe('updateAccessToken', () => {
    it('should update access token in localStorage', () => {
      const newAccessToken = 'new-access-token'

      tokenManager.updateAccessToken(newAccessToken)

      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', newAccessToken)
    })
  })
})
