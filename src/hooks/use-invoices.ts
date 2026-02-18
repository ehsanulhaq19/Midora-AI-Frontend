import { useCallback, useState, useEffect } from 'react'
import { invoiceApi } from '@/api/invoices/api'
import { Invoice } from '@/api/invoices/types'
import { useToast } from './use-toast'
import { handleApiError } from '@/lib/error-handler'

interface UseInvoicesReturn {
  invoices: Invoice[]
  isLoading: boolean
  error: string | null
  loadInvoices: () => Promise<void>
  downloadInvoice: (invoiceSubscriptionUuid: string) => Promise<void>
}

export const useInvoices = (): UseInvoicesReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  /**
   * Load all invoices for the current user
   */
  const loadInvoices = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await invoiceApi.getUserInvoices()

      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'INVOICE_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        setError(response.error)
        throw new Error(JSON.stringify(errorObject))
      }

      const invoicesData = response.data || []
      setInvoices(invoicesData)
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Load Invoices', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Toast functions are stable and don't need to be in dependencies

  /**
   * Download invoice PDF
   */
  const downloadInvoice = useCallback(async (invoiceSubscriptionUuid: string) => {
    console.log('downloadInvoice', invoiceSubscriptionUuid)
    try {
      const response = await invoiceApi.downloadInvoice(invoiceSubscriptionUuid)

      // Create a blob URL and trigger download
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = response.filename || 'invoice.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      showSuccessToast('Invoice Downloaded', 'Invoice has been downloaded successfully')
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Download Failed', errorMessage)
      throw err
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Toast functions are stable and don't need to be in dependencies

  return {
    invoices,
    isLoading,
    error,
    loadInvoices,
    downloadInvoice
  }
}

