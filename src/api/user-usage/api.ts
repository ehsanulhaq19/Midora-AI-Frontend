/**
 * User Usage API client
 * Handles all user usage and credits-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import { UserCreditsAndSubscriptionInfo, QueryUsageAnalyticsData, QueryUsageListItem } from './types'

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

  /**
   * Get user query usage analytics within a date range
   */
  async getQueryUsageAnalytics(
    startTime: string,
    endTime: string
  ): Promise<ApiResponse<QueryUsageAnalyticsData>> {
    const params = new URLSearchParams({
      start_time: startTime,
      end_time: endTime,
    })
    return this.baseClient.get<QueryUsageAnalyticsData>(
      `/api/v1/query-usage/analytics?${params.toString()}`
    )
  }

  /**
   * Get user query usage list within a date range
   */
  async getQueryUsageList(
    startTime: string,
    endTime: string
  ): Promise<ApiResponse<QueryUsageListItem[]>> {
    const params = new URLSearchParams({
      start_time: startTime,
      end_time: endTime,
    })
    return this.baseClient.get<QueryUsageListItem[]>(
      `/api/v1/query-usage/list?${params.toString()}`
    )
  }
}

// Export singleton instance
export const userUsageApi = new UserUsageApiClient()

// Export the class for custom instances
export { UserUsageApiClient }

