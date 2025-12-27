'use client'

import React, { useState, useEffect } from 'react'
import { Close } from '@/icons'
import { t } from '@/i18n'
import { UserPaymentMethod } from '@/api/user-payment-methods/types'

interface DeletePaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  paymentMethod: UserPaymentMethod | null
}

export const DeletePaymentMethodModal: React.FC<DeletePaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  paymentMethod,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setIsDeleting(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Delete payment method error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isDeleting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose()
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[color:var(--tokens-color-surface-surface-primary)] rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
            {t('account.paymentMethods.deleteTitle')}
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <Close
              className="w-5 h-5"
              color="var(--tokens-color-text-text-primary)"
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-[color:var(--tokens-color-text-text-primary)]">
            {t('account.paymentMethods.deleteConfirmation')}
          </p>
          {paymentMethod && (
            <div className="p-3 rounded-lg bg-[color:var(--tokens-color-surface-surface-secondary)]">
              <span className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)]">
                {paymentMethod.card_name || `Card ending in ${paymentMethod.last_4_digits}`}
              </span>
            </div>
          )}
          <p className="text-sm text-[color:var(--tokens-color-text-text-seconary)]">
            {t('account.paymentMethods.deleteWarning')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
          >
            {t('account.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isDeleting
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:opacity-90"
            }`}
          >
            {isDeleting ? t('account.paymentMethods.deleting') : t('account.paymentMethods.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

