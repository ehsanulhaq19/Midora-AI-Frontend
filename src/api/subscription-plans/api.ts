/**
 * Subscription Plans API client
 * Handles all subscription plan-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import { 
  SubscriptionPlan, 
  AiModelEstimate,
  SubscriptionCheckoutRequest,
  SubscriptionCheckoutResponse,
  ActiveSubscription
} from './types'

class SubscriptionPlansApiClient {
  private baseClient = baseApiClient

  /**
   * Get all subscription plans
   */
  async getAllPlans(activeOnly: boolean = false): Promise<ApiResponse<SubscriptionPlan[]>> {
    return this.baseClient.get<SubscriptionPlan[]>(
      `/api/v1/subscription-plans?active_only=${activeOnly}`
    )
  }

  /**
   * Get model estimates for a specific subscription plan
   */
  async getModelEstimates(planUuid: string): Promise<ApiResponse<AiModelEstimate[]>> {
    return this.baseClient.get<AiModelEstimate[]>(
      `/api/v1/subscription-plans/${planUuid}/model-estimates`
    )
  }

  /**
   * Checkout subscription
   */
  async checkout(data: SubscriptionCheckoutRequest): Promise<ApiResponse<SubscriptionCheckoutResponse>> {
    return this.baseClient.post<SubscriptionCheckoutResponse>(
      '/api/v1/user-subscription-checkout',
      data
    )
  }

  /**
   * Get active subscription for current user
   */
  async getActiveSubscription(): Promise<ApiResponse<ActiveSubscription>> {
    return this.baseClient.get<ActiveSubscription>(
      '/api/v1/user-subscription-checkout/active'
    )
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionUuid: string): Promise<ApiResponse<ActiveSubscription>> {
    return this.baseClient.post<ActiveSubscription>(
      `/api/v1/user-subscription-checkout/${subscriptionUuid}/cancel`
    )
  }
}

// Export singleton instance
export const subscriptionPlansApi = new SubscriptionPlansApiClient()

// Export the class for custom instances
export { SubscriptionPlansApiClient }

