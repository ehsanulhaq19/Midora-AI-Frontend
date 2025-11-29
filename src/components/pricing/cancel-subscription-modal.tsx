'use client'

import React from 'react'
import { Close } from '@/icons'

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
            Cancel Subscription
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
            We're sorry to see you go! Your <strong>{planName}</strong> subscription has been incredibly valuable, providing you with:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-[color:var(--tokens-color-text-text-seconary)] ml-2">
            <li>Access to premium AI models and features</li>
            <li>Enhanced productivity tools</li>
            <li>Priority support</li>
            <li>Advanced capabilities for your projects</li>
          </ul>

          <p className="text-[color:var(--tokens-color-text-text-primary)]">
            Are you sure you'd like to proceed with canceling? We'd love to keep you as a valued member of our community.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keep Subscription
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Canceling...' : 'Yes, Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  )
}

