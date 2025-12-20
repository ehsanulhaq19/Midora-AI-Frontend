/**
 * Invoice API client
 * Handles all invoice-related API calls
 */

import { baseApiClient, ApiResponse, FileDownloadResponse } from '../base'
import { Invoice } from './types'

class InvoiceApiClient {
  private baseClient = baseApiClient

  /**
   * Get all invoices for the current user
   */
  async getUserInvoices(): Promise<ApiResponse<Invoice[]>> {
    return this.baseClient.get<Invoice[]>(
      '/api/v1/invoice-subscription'
    )
  }

  /**
   * Download invoice PDF
   */
  async downloadInvoice(invoiceSubscriptionUuid: string): Promise<FileDownloadResponse> {
    return this.baseClient.downloadFile(
      `/api/v1/invoice-subscription/${invoiceSubscriptionUuid}/download`
    )
  }
}

// Export singleton instance
export const invoiceApi = new InvoiceApiClient()

// Export the class for custom instances
export { InvoiceApiClient }

