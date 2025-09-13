'use client'

import React from 'react'
import { Button } from '@/components/ui'
import { t } from '@/i18n'

interface NotFoundScreenProps {
  onGoHome?: () => void
  className?: string
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  onGoHome,
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-surface-primary px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-warning/10 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-warning"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.709A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-heading-primary font-semibold text-text-primary mb-4">
            {t('errors.notFound.title')}
          </h1>
          <p className="text-text-secondary">
            {t('errors.notFound.message')}
          </p>
        </div>
        
        {onGoHome && (
          <Button
            variant="primary"
            onClick={onGoHome}
            className="w-full"
          >
            {t('errors.notFound.goHome')}
          </Button>
        )}
      </div>
    </div>
  )
}
