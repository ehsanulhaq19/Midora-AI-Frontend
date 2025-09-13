'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { t } from '@/i18n'
import { authApi } from '@/api/auth/api'
import { handleApiError } from '@/lib/error-handler'
import { clearAuthTokens } from '@/lib/cookies'
import { PrimaryButton } from '@/components/ui/buttons/primary-button'

export const LogoutButton: React.FC = () => {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      // Call logout API
      await authApi.logout()
      
      // Clear cookies (access and refresh tokens)
      clearAuthTokens()
      
      // Redirect to signup page
      router.push('/signup')
    } catch (error: any) {
      console.error('Logout error:', error)
      // Even if logout API fails, clear cookies and redirect
      clearAuthTokens()
      router.push('/signup')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <PrimaryButton
      text={isLoggingOut ? t('auth.loggingOut') : t('auth.logout')}
      onClick={handleLogout}
      disabled={isLoggingOut}
      loading={isLoggingOut}
      className="!bg-red-600 hover:!bg-red-700 focus:!ring-red-500 max-w-[120px] mx-auto"
    />
  )
}
