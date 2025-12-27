/**
 * User Payment Methods API client
 * Handles all user payment method-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import { 
  UserPaymentMethod
} from './types'

class UserPaymentMethodsApiClient {
  private baseClient = baseApiClient

  /**
   * Get all active payment methods for current user
   */
  async getActivePaymentMethods(): Promise<ApiResponse<UserPaymentMethod[]>> {
    return this.baseClient.get<UserPaymentMethod[]>(
      `/api/v1/user-payment-methods`
    )
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(paymentMethodUuid: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.baseClient.delete<{ deleted: boolean }>(
      `/api/v1/user-payment-methods/${paymentMethodUuid}`
    )
  }

  /**
   * Create a payment method with Stripe
   */
  async createPaymentMethod(data: {
    payment_method_id: string
    full_name: string
    email: string
    country: string
    address_line_1: string
    address_line_2?: string
    city?: string
    state?: string
    postal_code?: string
  }): Promise<ApiResponse<UserPaymentMethod>> {
    return this.baseClient.post<UserPaymentMethod>(
      `/api/v1/user-payment-methods`,
      data
    )
  }
}

// Export singleton instance
export const userPaymentMethodsApi = new UserPaymentMethodsApiClient()

// Export the class for custom instances
export { UserPaymentMethodsApiClient }

