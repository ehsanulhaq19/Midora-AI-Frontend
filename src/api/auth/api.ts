/**
 * Authentication API client
 * Handles all authentication-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import { 
  UserLogin, 
  UserCreate, 
  Token, 
  UserResponse, 
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  OTPVerificationRequest,
  OTPVerificationResponse,
  OTPRegenerationRequest,
  OTPRegenerationResponse
} from './types'

class AuthApiClient {
  private baseClient = baseApiClient

  /**
   * Register a new user
   */
  async register(userData: UserCreate): Promise<ApiResponse<UserResponse>> {
    return this.baseClient.post<UserResponse>('/api/v1/auth/register', userData)
  }

  /**
   * Login user and get tokens
   */
  async login(credentials: UserLogin): Promise<ApiResponse<Token>> {
    return this.baseClient.post<Token>('/api/v1/auth/login', credentials)
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<Token>> {
    return this.baseClient.post<Token>('/api/v1/auth/refresh', { refresh_token: refreshToken })
  }


  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.baseClient.post<void>('/api/v1/auth/logout', {})
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    return this.baseClient.get<UserResponse>('/api/v1/auth/me')
  }

  /**
   * Forgot password - send OTP to email
   */
  async forgotPassword(email: string): Promise<ApiResponse<ForgotPasswordResponse>> {
    return this.baseClient.post<ForgotPasswordResponse>('/api/v1/auth/forgot-password', { email })
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(data: PasswordResetRequest): Promise<ApiResponse<PasswordResetResponse>> {
    return this.baseClient.post<PasswordResetResponse>('/api/v1/auth/reset-password', data)
  }

  /**
   * Verify OTP for email verification
   */
  async verifyOTP(data: OTPVerificationRequest): Promise<ApiResponse<OTPVerificationResponse>> {
    return this.baseClient.post<OTPVerificationResponse>('/api/v1/otp/registration/verify', data)
  }

  /**
   * Regenerate OTP for email verification
   */
  async regenerateOTP(email: string): Promise<ApiResponse<OTPRegenerationResponse>> {
    return this.baseClient.post<OTPRegenerationResponse>('/api/v1/otp/registration/regenerate', { email })
  }
}

// Export singleton instance
export const authApi = new AuthApiClient()

// Export the class for custom instances
export { AuthApiClient }
