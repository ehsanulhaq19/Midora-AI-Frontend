'use client'

import React, { useState, useEffect } from 'react'
import { Close } from '@/icons'
import { t } from '@/i18n'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
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
      console.error('Delete account error:', error)
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
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
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
            {t('account.deleteAccountTitle')}
          </h2>
          <div className="flex items-center gap-2">
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
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-[color:var(--tokens-color-text-text-primary)]">
            {t('account.deleteAccountConfirmation')}
          </p>
          <p className="text-sm text-[color:var(--tokens-color-text-text-seconary)]">
            {t('account.deleteAccountWarning')}
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
                : "bg-[color:var(--tokens-color-surface-surface-button)] text-white hover:opacity-90"
            }`}
          >
            {isDeleting ? t('account.deleting') : t('account.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  )
}

