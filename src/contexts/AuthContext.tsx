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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = getAccessToken()
        const refreshToken = getRefreshToken()
        const userData = getUserData()

        if (accessToken && refreshToken && userData) {
          if (isTokenExpired(accessToken)) {
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
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      if (response.data) {
        console.log('Login successful, storing tokens...', response.data)
        const { access_token, refresh_token } = response.data
        
        setTokens(access_token, refresh_token)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const userResponse = await authApi.getCurrentUser()
        if (userResponse.error || !userResponse.data) {
          throw new Error('Failed to get user data')
        }

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

        try {
          const urlParams = new URLSearchParams(window.location.search)
          const returnUrl = urlParams.get('returnUrl') || '/dashboard'
          router.push(returnUrl)
        } catch (redirectError) {
          console.error('Redirect error:', redirectError)
          router.push('/dashboard')
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
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      if (response.data) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }))
        
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

      await authApi.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      clearAuthCookies()
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      
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
        const errorMessage = response.processedError?.message || 'Token refresh failed'
        throw new Error(errorMessage)
      }

      const { access_token, refresh_token: newRefreshToken } = response.data
      
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
      await logout()
      throw error
    }
  }, [logout])

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authApi.forgotPassword(email)
      
      if (response.error) {
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
