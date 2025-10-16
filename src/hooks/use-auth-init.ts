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
import { setTokens } from '@/lib/auth'

export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch(setLoading(true))

        const tokens = tokenManager.getTokens()

        if (tokens.accessToken && tokens.refreshToken) {
          setTokens(tokens.accessToken, tokens.refreshToken)
          
          const userResponse = await authApi.getCurrentUser()
          
          if (userResponse.data) {
            dispatch(initializeAuth({
              user: userResponse.data,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              authMethod: (tokens.authMethod as 'email' | 'google' | 'microsoft' | 'github') || 'email'
            }))
          } else {
            tokenManager.clearTokens()
          }
        }
      } catch (error: any) {
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
