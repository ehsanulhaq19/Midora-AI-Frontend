import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { authApi } from '@/api/auth/api'
import { setTokens } from '@/lib/auth'
import { handleApiError } from '@/lib/error-handler'
import { loginSuccess, setLoading, setError, clearError } from '@/store/slices/authSlice'
import { tokenManager } from '@/lib/token-manager'

interface UseOTPLoginReturn {
  verifyOTPAndLogin: (email: string, password: string, otpCode: string) => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

/**
 * Custom hook for handling OTP verification and automatic login
 * Verifies OTP first, then logs in the user and redirects to chat
 */
export const useOTPLogin = (): UseOTPLoginReturn => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  
  // Get error from Redux store
  const error = useAppSelector((state) => state.auth.error)

  const clearErrorCallback = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const verifyOTPAndLogin = useCallback(async (email: string, password: string, otpCode: string) => {
    if (isLoading) return
    
    setIsLoading(true)
    dispatch(setLoading(true))
    dispatch(clearError())
    
    try {
      // First verify OTP
      const verifyResponse = await authApi.verifyOTP({
        email,
        otp_code: otpCode
      })
      
      if (verifyResponse.error) {
        throw new Error(verifyResponse.error)
      }
      
      // After successful OTP verification, login the user
      const loginResponse = await authApi.login({ email, password })
      
      if (loginResponse.error) {
        throw new Error(loginResponse.error)
      }
      
      if (loginResponse.data) {
        // Get user info from the token or make a separate API call
        const userResponse = await authApi.getCurrentUser()
        
        if (userResponse.data) {
          // Store auth data in Redux
          dispatch(loginSuccess({
            user: userResponse.data,
            accessToken: loginResponse.data.access_token,
            refreshToken: loginResponse.data.refresh_token,
            authMethod: 'email'
          }))

          // Store tokens using token manager
          tokenManager.storeTokens(
            loginResponse.data.access_token,
            loginResponse.data.refresh_token,
            'email'
          )
          
          // Also save tokens to cookies for middleware access
          setTokens(loginResponse.data.access_token, loginResponse.data.refresh_token)
          
          // Redirect to chat page
          router.push('/chat')
        } else {
          throw new Error('Failed to get user information')
        }
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }, [isLoading, router, dispatch])

  return {
    verifyOTPAndLogin,
    isLoading,
    error,
    clearError: clearErrorCallback
  }
}
