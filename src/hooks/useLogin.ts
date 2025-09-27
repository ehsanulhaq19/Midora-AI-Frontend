import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { authApi } from '@/api/auth/api'
import { loginSuccess, setLoading, setError, clearError } from '@/store/slices/authSlice'
import { handleApiError } from '@/lib/error-handler'
import { tokenManager } from '@/lib/token-manager'
import { setTokens } from '@/lib/auth'

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

/**
 * Custom hook for handling login functionality
 * Handles login API call, token storage, and redirection to chat
 */
export const useLogin = (): UseLoginReturn => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  
  // Get error from Redux store
  const error = useAppSelector((state) => state.auth.error)

  const clearErrorCallback = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const login = useCallback(async (email: string, password: string) => {
    if (isLoading) {
      console.warn('Login already in progress')
      return
    }
    
    try {
      setIsLoading(true)
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await authApi.login({ email, password })
      if (response.error) {
        throw new Error(response.error)
      }
      
      if (response.data) {
        tokenManager.storeTokens(
          response.data.access_token,
          response.data.refresh_token,
          'email'
        )
        
        setTokens(response.data.access_token, response.data.refresh_token)

        const userResponse = await authApi.getCurrentUser()
        
        if (userResponse.data) {
          dispatch(loginSuccess({
            user: userResponse.data,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            authMethod: 'email'
          }))
          
          router.push('/chat')
        } else {
          throw new Error('Failed to get user information')
        }
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      throw err 
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }, [isLoading, router, dispatch])

  return {
    login,
    isLoading,
    error,
    clearError: clearErrorCallback
  }
}
