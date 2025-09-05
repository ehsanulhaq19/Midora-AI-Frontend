'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  AuthContextType, 
  AuthState, 
  UserLogin, 
  UserCreate, 
  User,
  ForgotPasswordRequest,
  PasswordResetRequest,
  OTPVerificationRequest
} from '@/api/auth/types'
import { authApi } from '@/api/auth/api'
import { 
  setTokens,
  setUserData, 
  getAccessToken, 
  getRefreshToken,
  getUserData,
  clearAuthCookies,
  isTokenExpired
} from '@/lib/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = getAccessToken()
        const refreshToken = getRefreshToken()
        const userData = getUserData()

        if (accessToken && refreshToken && userData) {
          // Check if access token is expired
          if (isTokenExpired(accessToken)) {
            // If access token is expired but refresh token exists, user is still authenticated
            // The app should attempt to refresh the access token
            if (!isTokenExpired(refreshToken)) {
              setState(prev => ({
                ...prev,
                user: userData,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
              }))
            } else {
              // Both tokens expired, clear auth
              clearAuthCookies()
              setState(prev => ({
                ...prev,
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
              }))
            }
          } else {
            // Tokens are valid, set user state
            setState(prev => ({
              ...prev,
              user: userData,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
            }))
          }
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
          }))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize authentication',
        }))
      }
    }

    initializeAuth()
  }, [])


  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const login = useCallback(async (credentials: UserLogin) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.login(credentials)
      
      if (response.error) {
        // Use the processed error message if available, otherwise use the raw error
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      if (response.data) {
        console.log('Login successful, storing tokens...', response.data)
        const { access_token, refresh_token } = response.data
        
        console.log('Login successful, storing tokens...')
        // Store tokens FIRST before making any API calls
        setTokens(access_token, refresh_token)
        console.log('Tokens stored, now getting user data...')
        
        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Now get user data (interceptor will find the access token in cookies)
        const userResponse = await authApi.getCurrentUser()
        if (userResponse.error || !userResponse.data) {
          throw new Error('Failed to get user data')
        }
        console.log('User data retrieved successfully')

        // Store user data
        setUserData(userResponse.data)

        setState(prev => ({
          ...prev,
          user: userResponse.data,
          accessToken: access_token,
          refreshToken: refresh_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }))

        // Redirect to chat or return URL
        try {
          const urlParams = new URLSearchParams(window.location.search)
          const returnUrl = urlParams.get('returnUrl') || '/chat'
          router.push(returnUrl)
        } catch (redirectError) {
          console.error('Redirect error:', redirectError)
          // Fallback redirect
          router.push('/chat')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }))
    }
  }, [router])

  const register = useCallback(async (userData: UserCreate) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.register(userData)
      
      if (response.error) {
        // Use the processed error message if available, otherwise use the raw error
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      if (response.data) {
        // Registration successful, but user needs to verify email
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }))
        
        // You might want to redirect to a verification page
        router.push('/login?message=Registration successful. Please check your email for verification.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }))
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      // Call logout API
      await authApi.logout()
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with logout even if API call fails
    } finally {
      // Clear local state and cookies
      clearAuthCookies()
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      
      // Redirect to home page
      router.push('/')
    }
  }, [router])

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken || isTokenExpired(refreshToken)) {
        throw new Error('No valid refresh token')
      }

      const response = await authApi.refreshToken(refreshToken)
      
      if (response.error || !response.data) {
        // Use the processed error message if available, otherwise use a generic message
        const errorMessage = response.processedError?.message || 'Token refresh failed'
        throw new Error(errorMessage)
      }

      const { access_token, refresh_token: newRefreshToken } = response.data
      
      // Update tokens
      setTokens(access_token, newRefreshToken)

      setState(prev => ({
        ...prev,
        accessToken: access_token,
        refreshToken: newRefreshToken,
        error: null,
      }))

      return access_token
    } catch (error) {
      console.error('Token refresh error:', error)
      // If refresh fails, logout user
      await logout()
      throw error
    }
  }, [logout])

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.forgotPassword(email)
      
      if (response.error) {
        // Use the processed error message if available, otherwise use the raw error
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      console.error('Forgot password error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send reset email',
      }))
    }
  }, [])

  const resetPassword = useCallback(async (data: PasswordResetRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.resetPassword(data)
      
      if (response.error) {
        // Use the processed error message if available, otherwise use the raw error
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      console.error('Reset password error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      }))
    }
  }, [])

  const verifyOTP = useCallback(async (data: OTPVerificationRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.verifyOTP(data)
      
      if (response.error) {
        // Use the processed error message if available, otherwise use the raw error
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      console.error('OTP verification error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'OTP verification failed',
      }))
    }
  }, [])

  const regenerateOTP = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.regenerateOTP(email)
      
      if (response.error) {
        // Use the processed error message if available, otherwise use the raw error
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      console.error('OTP regeneration error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to regenerate OTP',
      }))
    }
  }, [])

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    verifyOTP,
    regenerateOTP,
    clearError,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
