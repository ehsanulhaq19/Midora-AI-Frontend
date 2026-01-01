/**
 * User API types
 * Type definitions for all user-related API requests and responses
 */

export interface UserProfileResponse {
  uuid: string
  email: string
  username: string
  first_name: string
  last_name: string
  is_active: boolean
  is_verified: boolean
  is_onboarded: boolean
  profile_picture: string | null
  language: string | null
  created_at: string
  updated_at: string | null
}

export interface UserProfileUpdateRequest {
  first_name?: string
  last_name?: string
  password?: string
  profile_picture?: string | null
  language?: string | null
}

