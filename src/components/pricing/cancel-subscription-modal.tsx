'use client'

import React from 'react'
import { Close } from '@/icons'
import { t, tWithParams } from '@/i18n'

interface CancelSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  planName: string
  isLoading?: boolean
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
  isLoading = false
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[color:var(--tokens-color-surface-surface-primary)] rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-[color:var(--tokens-color-text-text-primary)]">
            {t('pricing.cancelSubscriptionTitle')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
            aria-label="Close"
            disabled={isLoading}
          >
            <Close
              className="w-5 h-5"
              color="var(--tokens-color-text-text-primary)"
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-[color:var(--tokens-color-text-text-primary)]">
            {tWithParams('pricing.cancelSubscriptionMessage', { planName })}
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-[color:var(--tokens-color-text-text-seconary)] ml-2">
            <li>{t('pricing.cancelSubscriptionFeatures.premiumAccess')}</li>
            <li>{t('pricing.cancelSubscriptionFeatures.productivityTools')}</li>
            <li>{t('pricing.cancelSubscriptionFeatures.prioritySupport')}</li>
            <li>{t('pricing.cancelSubscriptionFeatures.advancedCapabilities')}</li>
          </ul>

          <p className="text-[color:var(--tokens-color-text-text-primary)]">
            {t('pricing.cancelSubscriptionConfirm')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('pricing.keepSubscription')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('pricing.canceling') : t('pricing.yesCancelSubscription')}
          </button>
        </div>
      </div>
    </div>
  )
}

