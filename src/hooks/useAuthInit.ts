/**
 * Custom hook for initializing authentication state
 * Restores auth state from localStorage on app startup
 */

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { authApi } from '@/api/auth/api'
import { initializeAuth, setLoading, setError } from '@/store/slices/authSlice'
import { handleApiError } from '@/lib/error-handler'
import { tokenManager } from '@/lib/token-manager'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch(setLoading(true))

        // Check if we have stored tokens using token manager
        const tokens = tokenManager.getTokens()

        if (tokens.accessToken && tokens.refreshToken) {
          // Set the token in the API client for subsequent requests
          // This should be done in the base API client
          
          // Verify the token by getting current user
          const userResponse = await authApi.getCurrentUser()
          
          if (userResponse.data) {
            // Initialize auth state with stored data
            dispatch(initializeAuth({
              user: userResponse.data,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              authMethod: (tokens.authMethod as 'email' | 'google' | 'microsoft' | 'github') || 'email'
            }))
          } else {
            // Token is invalid, clear stored data
            tokenManager.clearTokens()
          }
        }
      } catch (error: any) {
        // Token is invalid or expired, clear stored data
        tokenManager.clearTokens()
        
        const errorMessage = handleApiError(error)
        dispatch(setError(errorMessage))
      } finally {
        dispatch(setLoading(false))
      }
    }

    initAuth()
  }, [dispatch])
}
