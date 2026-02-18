import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, SSOUser } from '@/api/auth/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  authMethod: 'email' | 'google' | 'microsoft' | 'github' | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authMethod: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error state
    setError: (state: AuthState, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Clear error state
    clearError: (state: AuthState) => {
      state.error = null
    },

    // Login success - set user data and tokens
    loginSuccess: (state: AuthState, action: PayloadAction<{
      user: User
      accessToken: string
      refreshToken: string
      authMethod?: 'email' | 'google' | 'microsoft' | 'github'
    }>) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      state.authMethod = action.payload.authMethod || 'email'
    },

    // Update user data
    updateUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload
    },

    // Update tokens
    updateTokens: (state: AuthState, action: PayloadAction<{
      accessToken: string
      refreshToken: string
    }>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },

    // Logout - clear all auth data
    logout: (state: AuthState) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      state.authMethod = null
    },

    // Initialize auth state from stored data
    initializeAuth: (state: AuthState, action: PayloadAction<{
      user: User
      accessToken: string
      refreshToken: string
      authMethod?: 'email' | 'google' | 'microsoft' | 'github'
    }>) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      state.authMethod = action.payload.authMethod || 'email'
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  updateUser,
  updateTokens,
  logout,
  initializeAuth,
} = authSlice.actions

export default authSlice.reducer
