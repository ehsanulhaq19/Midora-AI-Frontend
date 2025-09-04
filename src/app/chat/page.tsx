'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { t, tWithParams } from '@/i18n'

export default function ChatPage() {
  const { user, logout, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [currentStep])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome, {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
{t('auth.logout')}
          </Button>
        </div>

        <div className="text-center space-y-8">
          {/* Main Title */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
              {t('chat.title')}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
              {t('chat.subtitle')}
            </p>
          </div>

          {/* Simple Welcome Steps */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: t('chat.welcomeToMidoraAI'), icon: '👋' },
              { title: t('chat.aiPoweredExperience'), icon: '🚀' },
              { title: t('chat.advancedFeatures'), icon: '✨' },
              { title: t('chat.readyToServe'), icon: '🤖' },
              { title: t('chat.comingSoon'), icon: '⏳' }
            ].map((step, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-500
                  ${index <= currentStep 
                    ? 'border-primary-200 bg-white shadow-lg' 
                    : 'border-neutral-200 bg-neutral-50 opacity-50'
                  }
                `}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-600">
                  {tWithParams('chat.stepOfWelcome', { step: index + 1 })}
                </p>
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {currentStep >= 4 && (
            <div className="mt-12 p-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-2">🎉 {t('chat.welcomeComplete')}</h2>
              <p className="text-lg opacity-90">
                {t('chat.allSet')} {t('chat.featuresLaunchingSoon')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
