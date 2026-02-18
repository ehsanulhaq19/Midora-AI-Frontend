'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Spinner } from '@/components/ui/loaders'
import { tokenManager } from '@/lib/token-manager'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  )
}) => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isLoading) {
      const hasValidTokens = tokenManager.hasValidTokens()
      
      if (!isAuthenticated && !hasValidTokens) {
        const currentPath = window.location.pathname
        const signupUrl = `/signup${currentPath !== '/signup' ? `?returnUrl=${encodeURIComponent(currentPath)}` : ''}`
        router.push(signupUrl)
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <>{fallback}</>
  }

  if (isAuthenticated || tokenManager.hasValidTokens()) {
    return <>{children}</>
  }

  return null
}
