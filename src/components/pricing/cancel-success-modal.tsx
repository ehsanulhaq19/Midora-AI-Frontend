'use client'

import React from 'react'
import { Close } from '@/icons'

interface CancelSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CancelSuccessModal: React.FC<CancelSuccessModalProps> = ({
  isOpen,
  onClose
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
            Subscription Canceled
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
            aria-label="Close"
          >
            <Close
              className="w-5 h-5"
              color="var(--tokens-color-text-text-primary)"
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[color:var(--tokens-color-text-text-primary)] text-lg mb-2">
              We'll Miss You!
            </p>
          </div>

          <p className="text-[color:var(--tokens-color-text-text-seconary)] text-center">
            Your subscription has been successfully canceled.
          </p>

          <p className="text-[color:var(--tokens-color-text-text-seconary)] text-center">
            We hope to see you again in the future! If you change your mind, you can reactivate your subscription anytime.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-[color:var(--premitives-color-brand-purple-1000)] text-white hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

