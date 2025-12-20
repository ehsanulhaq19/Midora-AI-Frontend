/**
 * User API client
 * Handles all user-related API calls including profile management
 */

import { baseApiClient, ApiResponse } from '../base'
import { UserProfileResponse, UserProfileUpdateRequest } from './types'

class UserApiClient {
  private baseClient = baseApiClient

  /**
   * Get user profile information
   */
  async getProfile(): Promise<ApiResponse<UserProfileResponse>> {
    return this.baseClient.get<UserProfileResponse>('/api/v1/user/profile')
  }

  /**
   * Update user profile information
   */
  async updateProfile(data: UserProfileUpdateRequest): Promise<ApiResponse<UserProfileResponse>> {
    return this.baseClient.put<UserProfileResponse>('/api/v1/user/profile', data)
  }
}

// Export singleton instance
export const userApi = new UserApiClient()

// Export the class for custom instances
export { UserApiClient }

