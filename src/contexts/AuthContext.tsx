'use client'

import React, { createContext, useContext } from 'react'
import { useAuth as useAuthHook } from '@/hooks/use-auth'
import { AuthContextType } from '@/api/auth/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Use the consolidated auth hook
  const authHook = useAuthHook()

  const contextValue: AuthContextType = {
    ...authHook
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
