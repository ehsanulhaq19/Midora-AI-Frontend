'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Spinner } from '@/components/ui/loaders'

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
    // Check if user is authenticated
    if (!isLoading && !isAuthenticated) {
      // Redirect to signup page if not authenticated
      router.push('/signup')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return <>{fallback}</>
  }

  // Show children only if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Return null while redirecting
  return null
}
