import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/api/auth/api'
import { setAuthTokens } from '@/lib/cookies'
import { handleApiError } from '@/lib/error-handler'

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const verifyOTPAndLogin = useCallback(async (email: string, password: string, otpCode: string) => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)
    
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
        // Save tokens to cookies
        setAuthTokens(loginResponse.data.access_token, loginResponse.data.refresh_token)
        
        // Redirect to chat page
        router.push('/chat')
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, router])

  return {
    verifyOTPAndLogin,
    isLoading,
    error,
    clearError
  }
}
