'use client'

import React from 'react'
import { Button } from '@/components/ui'
import { t } from '@/i18n'

interface UnauthorizedScreenProps {
  onGoHome?: () => void
  onLogin?: () => void
  className?: string
}

export const UnauthorizedScreen: React.FC<UnauthorizedScreenProps> = ({
  onGoHome,
  onLogin,
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-surface-primary px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-heading-primary font-semibold text-text-primary mb-4">
            {t('errors.unauthorized.title')}
          </h1>
          <p className="text-text-secondary">
            {t('errors.unauthorized.message')}
          </p>
        </div>
        
        <div className="space-y-3">
          {onLogin && (
            <Button
              variant="primary"
              onClick={onLogin}
              className="w-full"
            >
              {t('errors.unauthorized.login')}
            </Button>
          )}
          {onGoHome && (
            <Button
              variant="outline"
              onClick={onGoHome}
              className="w-full"
            >
              {t('errors.unauthorized.goHome')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
