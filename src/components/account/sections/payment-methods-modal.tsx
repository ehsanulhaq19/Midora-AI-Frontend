'use client'

import React, { useState, useEffect } from 'react'
import { Close, Trash } from '@/icons'
import { t } from '@/i18n'
import { ActionButton } from '@/components/ui/buttons'
import { userPaymentMethodsApi } from '@/api/user-payment-methods/api'
import { UserPaymentMethod } from '@/api/user-payment-methods/types'
import { useToast } from '@/hooks/use-toast'
import { handleApiError } from '@/lib/error-handler'
import { DeletePaymentMethodModal } from './delete-payment-method-modal'
import { AddPaymentMethodModal } from './add-payment-method-modal'

interface PaymentMethodsModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentMethodAdded?: () => void
  onPaymentMethodDeleted?: () => void
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({
  isOpen,
  onClose,
  onPaymentMethodAdded,
  onPaymentMethodDeleted,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<UserPaymentMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<UserPaymentMethod | null>(null)
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      fetchPaymentMethods()
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await userPaymentMethodsApi.getActivePaymentMethods()
      if (response.success && response.data) {
        setPaymentMethods(response.data)
      } else {
        showErrorToast('Error', handleApiError(response.processedError || response))
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
      showErrorToast('Error', handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (paymentMethod: UserPaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPaymentMethod) return

    try {
      const response = await userPaymentMethodsApi.deletePaymentMethod(selectedPaymentMethod.uuid)
      if (response.success) {
        showSuccessToast('Success', 'Payment method deleted successfully')
        await fetchPaymentMethods()
        onPaymentMethodDeleted?.()
      } else {
        showErrorToast('Error', handleApiError(response.processedError || response))
      }
    } catch (error) {
      console.error('Failed to delete payment method:', error)
      showErrorToast('Error', handleApiError(error))
    } finally {
      setDeleteModalOpen(false)
      setSelectedPaymentMethod(null)
    }
  }

  const handleAddSuccess = async () => {
    await fetchPaymentMethods()
    onPaymentMethodAdded?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !deleteModalOpen && !addModalOpen) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget && !deleteModalOpen && !addModalOpen) {
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
          className="relative bg-[color:var(--tokens-color-surface-surface-primary)] rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--tokens-color-border-border-subtle)]">
            <h2 className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
              {t('account.paymentMethods.title')}
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
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-[color:var(--tokens-color-text-text-inactive-2)]">
                  {t('account.paymentMethods.loading')}
                </span>
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="text-[color:var(--tokens-color-text-text-inactive-2)] mb-4">
                  {t('account.paymentMethods.noPaymentMethods')}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.uuid}
                    className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-secondary)]"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)]">
                        {method.card_name || `Card ending in ${method.last_4_digits}`}
                      </span>
                      {method.last_4_digits && (
                        <span className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                          •••• {method.last_4_digits}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(method)}
                      className="p-2 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors text-red-500"
                      aria-label="Delete payment method"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[color:var(--tokens-color-border-border-subtle)]">
            <ActionButton
              onClick={() => setAddModalOpen(true)}
              variant="primary"
              size="sm"
            >
              {t('account.paymentMethods.addPaymentMethod')}
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePaymentMethodModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedPaymentMethod(null)
        }}
        onConfirm={handleDeleteConfirm}
        paymentMethod={selectedPaymentMethod}
      />

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  )
}

