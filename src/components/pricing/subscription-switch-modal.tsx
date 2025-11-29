'use client'

import React from 'react'
import { Close } from '@/icons'

interface SubscriptionSwitchModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
  currentPlanName: string
  newPlanName: string
}

export const SubscriptionSwitchModal: React.FC<SubscriptionSwitchModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  currentPlanName,
  newPlanName
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
            Switch Subscription Plan
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
          <p className="text-[color:var(--tokens-color-text-text-primary)]">
            You already have an active plan: <strong>{currentPlanName}</strong>
          </p>
          
          <p className="text-[color:var(--tokens-color-text-text-primary)]">
            If you want to activate <strong>{newPlanName}</strong>, we need to deactivate your previous plan.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
            <p className="text-sm text-[color:var(--tokens-color-text-text-seconary)]">
              <strong>Note:</strong> Your current subscription will be canceled and replaced with the new plan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 rounded-md font-medium text-sm transition-all bg-[color:var(--premitives-color-brand-purple-1000)] text-white hover:opacity-90"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

