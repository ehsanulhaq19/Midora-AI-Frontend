/**
 * User Usage API client
 * Handles all user usage and credits-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import { UserCreditsAndSubscriptionInfo } from './types'

class UserUsageApiClient {
  private baseClient = baseApiClient

  /**
   * Get user credits and subscription information
   */
  async getCreditsAndSubscriptionInfo(): Promise<ApiResponse<UserCreditsAndSubscriptionInfo>> {
    return this.baseClient.get<UserCreditsAndSubscriptionInfo>(
      '/api/v1/user-usage/credits-and-subscription'
    )
  }
}

// Export singleton instance
export const userUsageApi = new UserUsageApiClient()

// Export the class for custom instances
export { UserUsageApiClient }

