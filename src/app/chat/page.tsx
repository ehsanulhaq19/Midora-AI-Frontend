'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { AnimatedSlider } from '@/components/ui/AnimatedSlider'
import { t } from '@/i18n'

export default function ChatPage() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  const userName = user ? `${user.first_name} ${user.last_name}` : 'User'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      {/* Header with logout button */}
      <div className="flex justify-end items-center p-6">
        <Button
          onClick={logout}
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          {t('auth.logout')}
        </Button>
      </div>

      {/* Main content with animated slider */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatedSlider userName={userName} />
      </div>
    </div>
  )
}
