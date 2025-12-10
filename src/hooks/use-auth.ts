import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { authApi } from '@/api/auth/api'
import { 
  setLoading,
  setError,
  clearError,
  loginSuccess,
  updateUser,
  updateTokens,
  logout as logoutAction,
  initializeAuth
} from '@/store/slices/authSlice'
import { 
  UserLogin, 
  UserCreate, 
  PasswordResetRequest,
  OTPVerificationRequest,
  AuthContextType
} from '@/api/auth/types'
import { setTokens, clearAuthCookies } from '@/lib/auth'
import { tokenManager } from '@/lib/token-manager'
import { handleApiError } from '@/lib/error-handler'
import { resetThemeToSystem } from '@/hooks/use-theme'

type UseAuthReturn = AuthContextType

/**
 * Consolidated authentication hook that provides all authentication functionality
 * Combines login, logout, SSO, OTP, and password management
 */
export const useAuth = (): UseAuthReturn => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.auth)

  const clearErrorCallback = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const login = useCallback(async (credentials: UserLogin) => {
    try {
      dispatch(clearError())

      const response = await authApi.login(credentials)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'UNKNOWN_ERROR',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      if (response.data) {
        const { access_token, refresh_token } = response.data
        
        setTokens(access_token, refresh_token)
        tokenManager.storeTokens(access_token, refresh_token, 'email')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const userResponse = await authApi.getCurrentUser()
        if (userResponse.error || !userResponse.data) {
          const errorObject = {
            error_type: 'USER_DATA_FETCH_FAILED',
            error_message: 'Failed to get user data',
            error_id: userResponse.error_id,
            status: userResponse.status
          }
          throw new Error(JSON.stringify(errorObject))
        }

        dispatch(loginSuccess({
          user: userResponse.data,
          accessToken: access_token,
          refreshToken: refresh_token,
          authMethod: 'email'
        }))

        try {
          const urlParams = new URLSearchParams(window.location.search)
          const returnUrl = urlParams.get('returnUrl') || '/chat'
          router.push(returnUrl)
        } catch (redirectError) {
          router.push('/chat')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [router, dispatch])

  const register = useCallback(async (userData: UserCreate) => {
    try {
      dispatch(clearError())

      const response = await authApi.register(userData)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'UNKNOWN_ERROR',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      if (response.data) {
        dispatch(setLoading(false))
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {

      await authApi.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      clearAuthCookies()
      tokenManager.clearTokens()
      dispatch(logoutAction())
      // Reset theme to system on logout
      if (typeof window !== 'undefined') {
        resetThemeToSystem()
      }
      router.push('/')
    }
  }, [router, dispatch])

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = tokenManager.getTokens().refreshToken
      if (!refreshToken) {
        throw new Error('No valid refresh token')
      }

      const response = await authApi.refreshToken(refreshToken)
      
      if (response.error || !response.data) {
        const errorObject = response.processedError || {
          error_type: 'TOKEN_REFRESH_FAILED',
          error_message: 'Token refresh failed',
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      const { access_token, refresh_token: newRefreshToken } = response.data
      
      setTokens(access_token, newRefreshToken)
      tokenManager.storeTokens(access_token, newRefreshToken, authState.authMethod || 'email')

      dispatch(updateTokens({
        accessToken: access_token,
        refreshToken: newRefreshToken,
      }))

      return access_token
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
      throw error
    }
  }, [logout, dispatch, authState.authMethod])


  const resetPassword = useCallback(async (data: PasswordResetRequest) => {
    try {
      dispatch(clearError())

      const response = await authApi.resetPassword(data)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'UNKNOWN_ERROR',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const verifyOTP = useCallback(async (data: OTPVerificationRequest) => {
    try {
      dispatch(clearError())

      const response = await authApi.verifyOTP(data)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'UNKNOWN_ERROR',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('OTP verification error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const regenerateOTP = useCallback(async (email: string) => {
    try {
      dispatch(clearError())

      const response = await authApi.regenerateOTP(email)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'UNKNOWN_ERROR',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('OTP regeneration error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const updateProfile = useCallback(async (data: { first_name: string; last_name: string; profession: string }) => {
    try {
      dispatch(clearError())

      const response = await authApi.updateProfile(data)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROFILE_UPDATE_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      // Update user data in Redux store
      if (response.data) {
        dispatch(updateUser(response.data))
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const completeOnboarding = useCallback(async (data?: { first_name?: string; last_name?: string; profession?: string[] }) => {
    try {
      dispatch(clearError())

      const response = await authApi.completeOnboarding(data)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'ONBOARDING_COMPLETION_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('Onboarding completion error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const getCurrentUser = useCallback(async () => {
    try {
      dispatch(clearError())

      const response = await authApi.getCurrentUser()
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'USER_DATA_FETCH_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      // Update user data in Redux store
      if (response.data) {
        dispatch(updateUser(response.data))
      }

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      console.error('Get current user error:', error)
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  // SSO Methods
  const signInWithGoogle = useCallback(async () => {
    try {
      dispatch(setError(null))

      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('sso_state', state)

      const response = await authApi.getGoogleAuthUrl(state)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'SSO_AUTH_URL_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      if (response.data?.auth_url) {
        window.location.href = response.data.auth_url
      } else {
        const errorObject = {
          error_type: 'SSO_AUTH_URL_FAILED',
          error_message: 'Failed to get authorization URL',
          error_id: undefined,
          status: 500
        }
        throw new Error(JSON.stringify(errorObject))
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const signInWithMicrosoft = useCallback(async () => {
    try {
      dispatch(setError(null))

      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('sso_state', state)

      const response = await authApi.getMicrosoftAuthUrl(state)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'SSO_AUTH_URL_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      if (response.data?.auth_url) {
        window.location.href = response.data.auth_url
      } else {
        const errorObject = {
          error_type: 'SSO_AUTH_URL_FAILED',
          error_message: 'Failed to get authorization URL',
          error_id: undefined,
          status: 500
        }
        throw new Error(JSON.stringify(errorObject))
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const signInWithGitHub = useCallback(async () => {
    try {
      dispatch(setError(null))

      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('sso_state', state)

      const response = await authApi.getGitHubAuthUrl(state)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'SSO_AUTH_URL_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      if (response.data?.auth_url) {
        window.location.href = response.data.auth_url
      } else {
        const errorObject = {
          error_type: 'SSO_AUTH_URL_FAILED',
          error_message: 'Failed to get authorization URL',
          error_id: undefined,
          status: 500
        }
        throw new Error(JSON.stringify(errorObject))
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch])

  const handleSSOCallback = useCallback(async (
    provider: 'google' | 'microsoft' | 'github',
    code: string,
    state?: string
  ) => {
    try {
      dispatch(setError(null))

      // Verify state parameter for CSRF protection
      const storedState = sessionStorage.getItem('sso_state')
      if (state && storedState && state !== storedState) {
        const errorObject = {
          error_type: 'INVALID_STATE_PARAMETER',
          error_message: 'Invalid state parameter',
          error_id: undefined,
          status: 400
        }
        throw new Error(JSON.stringify(errorObject))
      }

      let response
      switch (provider) {
        case 'google':
          response = await authApi.handleGoogleCallback(code, state)
          break
        case 'microsoft':
          response = await authApi.handleMicrosoftCallback(code, state)
          break
        case 'github':
          response = await authApi.handleGitHubCallback(code, state)
          break
        default:
          const errorObject = {
          error_type: 'UNSUPPORTED_SSO_PROVIDER',
          error_message: 'Unsupported SSO provider',
          error_id: undefined,
          status: 400
        }
        throw new Error(JSON.stringify(errorObject))
      }

      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'SSO_AUTH_URL_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      if (response.data) {
        // Store tokens using token manager
        tokenManager.storeTokens(
          response.data.access_token,
          response.data.refresh_token,
          provider
        )
        
        // Also store in cookies for middleware access
        setTokens(response.data.access_token, response.data.refresh_token)

        // Clear the state from sessionStorage
        sessionStorage.removeItem('sso_state')

        // Check if user needs onboarding
        if (!response.data.user.is_onboarded) {
          // Redirect to signup page with SSO onboarding flow
          // The signup page will handle the onboarding process
          router.push('/signup')
        } else {
          // Store auth data in Redux and redirect to chat
          dispatch(loginSuccess({
            user: response.data.user,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            authMethod: provider
          }))
          
          // Redirect to chat page
          router.push('/chat')
        }
      } else {
        const errorObject = {
          error_type: 'INVALID_SSO_RESPONSE',
          error_message: 'Invalid response from SSO provider',
          error_id: undefined,
          status: 500
        }
        throw new Error(JSON.stringify(errorObject))
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      
      // Redirect to signup page on error
      router.push('/signup')
      throw error
    }
  }, [dispatch, router])

  // OTP Login method
  const verifyOTPAndLogin = useCallback(async (email: string, password: string, otpCode: string) => {
    try {
      dispatch(clearError())
      
      // First verify OTP
      const verifyResponse = await authApi.verifyOTP({
        email,
        otp_code: otpCode
      })
      
      if (verifyResponse.error) {
        const errorObject = verifyResponse.processedError || {
          error_type: 'OTP_VERIFICATION_FAILED',
          error_message: verifyResponse.error,
          error_id: verifyResponse.error_id,
          status: verifyResponse.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      // After successful OTP verification, login the user
      const loginResponse = await authApi.login({ email, password })
      
      if (loginResponse.error) {
        const errorObject = loginResponse.processedError || {
          error_type: 'LOGIN_FAILED',
          error_message: loginResponse.error,
          error_id: loginResponse.error_id,
          status: loginResponse.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      if (loginResponse.data) {
        const userResponse = await authApi.getCurrentUser()
        
        if (userResponse.data) {
          dispatch(loginSuccess({
            user: userResponse.data,
            accessToken: loginResponse.data.access_token,
            refreshToken: loginResponse.data.refresh_token,
            authMethod: 'email'
          }))

          tokenManager.storeTokens(
            loginResponse.data.access_token,
            loginResponse.data.refresh_token,
            'email'
          )
          
          setTokens(loginResponse.data.access_token, loginResponse.data.refresh_token)
          router.push('/chat')
        } else {
          const errorObject = {
            error_type: 'USER_DATA_FETCH_FAILED',
            error_message: 'Failed to get user information',
            error_id: userResponse.error_id,
            status: userResponse.status
          }
          throw new Error(JSON.stringify(errorObject))
        }
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      throw error
    }
  }, [dispatch, router])

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    
    // Actions
    login,
    register,
    logout,
    refreshAccessToken,
    resetPassword,
    verifyOTP,
    regenerateOTP,
    updateProfile,
    completeOnboarding,
    getCurrentUser,
    clearError: clearErrorCallback,
    
    // SSO Methods
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithGitHub,
    handleSSOCallback,
    
    // OTP Login
    verifyOTPAndLogin
  }
}
