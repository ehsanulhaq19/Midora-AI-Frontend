'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
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
  clearAuthCookies
} from '@/lib/auth'
import { tokenManager } from '@/lib/token-manager'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Get auth state from Redux
  const authState = useAppSelector((state) => state.auth)

  // Auth initialization is now handled by AuthInitializer component
  // This prevents conflicts between multiple initialization systems


  const clearErrorCallback = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const login = useCallback(async (credentials: UserLogin) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

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

        dispatch(loginSuccess({
          user: userResponse.data,
          accessToken: access_token,
          refreshToken: refresh_token,
        }))

        try {
          const urlParams = new URLSearchParams(window.location.search)
          const returnUrl = urlParams.get('returnUrl') || '/chat'
          router.push(returnUrl)
        } catch (redirectError) {
          console.error('Redirect error:', redirectError)
          router.push('/chat')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      dispatch(setError(error instanceof Error ? error.message : 'Login failed'))
      dispatch(setLoading(false))
    }
  }, [router, dispatch])

  const register = useCallback(async (userData: UserCreate) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await authApi.register(userData)
      
      if (response.error) {
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      if (response.data) {
        dispatch(setLoading(false))
      }
    } catch (error) {
      console.error('Registration error:', error)
      dispatch(setError(error instanceof Error ? error.message : 'Registration failed'))
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true))

      await authApi.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      clearAuthCookies()
      tokenManager.clearTokens()
      dispatch(logoutAction())
      router.push('/')
    }
  }, [router, dispatch])

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
      
      tokenManager.storeTokens(access_token, newRefreshToken, 'email')

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
  }, [logout, dispatch])

  const forgotPassword = useCallback(async (email: string) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await authApi.forgotPassword(email)
      
      if (response.error) {
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('Forgot password error:', error)
      dispatch(setError(error instanceof Error ? error.message : 'Failed to send reset email'))
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const resetPassword = useCallback(async (data: PasswordResetRequest) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await authApi.resetPassword(data)
      
      if (response.error) {
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('Reset password error:', error)
      dispatch(setError(error instanceof Error ? error.message : 'Password reset failed'))
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const verifyOTP = useCallback(async (data: OTPVerificationRequest) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await authApi.verifyOTP(data)
      
      if (response.error) {
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('OTP verification error:', error)
      dispatch(setError(error instanceof Error ? error.message : 'OTP verification failed'))
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const regenerateOTP = useCallback(async (email: string) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await authApi.regenerateOTP(email)
      
      if (response.error) {
        const errorMessage = response.processedError?.message || response.error
        throw new Error(errorMessage)
      }

      dispatch(setLoading(false))
    } catch (error) {
      console.error('OTP regeneration error:', error)
      dispatch(setError(error instanceof Error ? error.message : 'Failed to regenerate OTP'))
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    verifyOTP,
    regenerateOTP,
    clearError: clearErrorCallback,
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
