'use client'

import React from 'react'
import { Button } from '@/components/ui/buttons'
import { t } from '@/i18n'

interface ErrorScreenProps {
  title?: string
  message?: string
  onRetry?: () => void
  onGoHome?: () => void
  className?: string
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = t('errors.generic.title'),
  message = t('errors.generic.message'),
  onRetry,
  onGoHome,
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-heading-primary font-semibold text-text-primary mb-4">
            {title}
          </h1>
          <p className="text-text-secondary">
            {message}
          </p>
        </div>
        
        <div className="space-y-3">
          {onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              className="w-full"
            >
              {t('errors.generic.retry')}
            </Button>
          )}
          {onGoHome && (
            <Button
              variant="outline"
              onClick={onGoHome}
              className="w-full"
            >
              {t('errors.generic.goHome')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
