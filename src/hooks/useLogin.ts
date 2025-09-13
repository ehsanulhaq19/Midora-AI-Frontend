import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/api/auth/api'
import { setAuthTokens } from '@/lib/cookies'
import { handleApiError } from '@/lib/error-handler'

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Call login API
      const response = await authApi.login({ email, password })
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      if (response.data) {
        // Save tokens to cookies
        setAuthTokens(response.data.access_token, response.data.refresh_token)
        
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
    login,
    isLoading,
    error,
    clearError
  }
}
