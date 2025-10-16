/**
 * Tests for API Interceptors
 * Verifies that refresh token cookies are properly handled in API requests
 */

import { requestInterceptor } from '@/api/interceptors'
import { tokenManager } from '@/lib/token-manager'
import { appConfig } from '@/config/app'

// Mock token manager
jest.mock('@/lib/token-manager', () => ({
  tokenManager: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
  },
}))

// Mock app config
jest.mock('@/config/app', () => ({
  appConfig: {
    backendUrl: 'https://api.midora.ai',
  },
}))

describe('API Interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('requestInterceptor', () => {
    it('should add authorization header and credentials for backend API calls', () => {
      const accessToken = 'test-access-token'
      const refreshToken = 'test-refresh-token'
      const url = 'https://api.midora.ai/api/user/profile'
      const options = { method: 'GET' }

      ;(tokenManager.getAccessToken as jest.Mock).mockReturnValue(accessToken)
      ;(tokenManager.getRefreshToken as jest.Mock).mockReturnValue(refreshToken)

      const result = requestInterceptor(url, options)

      expect(result).toEqual({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })
    })

    it('should not add authorization for non-backend API calls', () => {
      const url = 'https://external-api.com/data'
      const options = { method: 'GET' }

      const result = requestInterceptor(url, options)

      expect(result).toEqual(options)
    })

    it('should handle requests without access token', () => {
      const refreshToken = 'test-refresh-token'
      const url = 'https://api.midora.ai/api/public/data'
      const options = { method: 'GET' }

      ;(tokenManager.getAccessToken as jest.Mock).mockReturnValue(null)
      ;(tokenManager.getRefreshToken as jest.Mock).mockReturnValue(refreshToken)

      const result = requestInterceptor(url, options)

      expect(result).toEqual({
        method: 'GET',
        headers: {},
        credentials: 'include',
      })
    })

    it('should handle requests without refresh token', () => {
      const accessToken = 'test-access-token'
      const url = 'https://api.midora.ai/api/user/profile'
      const options = { method: 'GET' }

      ;(tokenManager.getAccessToken as jest.Mock).mockReturnValue(accessToken)
      ;(tokenManager.getRefreshToken as jest.Mock).mockReturnValue(null)

      const result = requestInterceptor(url, options)

      expect(result).toEqual({
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })
    })

    it('should preserve existing headers and options', () => {
      const accessToken = 'test-access-token'
      const refreshToken = 'test-refresh-token'
      const url = 'https://api.midora.ai/api/user/profile'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value',
        },
        body: JSON.stringify({ data: 'test' }),
      }

      ;(tokenManager.getAccessToken as jest.Mock).mockReturnValue(accessToken)
      ;(tokenManager.getRefreshToken as jest.Mock).mockReturnValue(refreshToken)

      const result = requestInterceptor(url, options)

      expect(result).toEqual({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ data: 'test' }),
        credentials: 'include',
      })
    })

    it('should always include credentials for backend API calls', () => {
      const url = 'https://api.midora.ai/api/public/data'
      const options = { method: 'GET' }

      ;(tokenManager.getAccessToken as jest.Mock).mockReturnValue(null)
      ;(tokenManager.getRefreshToken as jest.Mock).mockReturnValue(null)

      const result = requestInterceptor(url, options)

      expect(result.credentials).toBe('include')
    })
  })
})
