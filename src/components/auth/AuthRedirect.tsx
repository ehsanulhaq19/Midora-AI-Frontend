'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { tokenManager } from '@/lib/token-manager'

interface AuthRedirectProps {
  children: React.ReactNode
  redirectTo?: string
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ 
  children, 
  redirectTo = '/chat' 
}) => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isLoading) {
      const hasValidTokens = tokenManager.hasValidTokens()
      
      if (isAuthenticated || hasValidTokens) {
        router.push(redirectTo)
      }
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  if (isLoading) {
    return null
  }

  if (isAuthenticated || tokenManager.hasValidTokens()) {
    return null
  }

  return <>{children}</>
}

