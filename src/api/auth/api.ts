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
  OTPRegenerationResponse,
  EmailCheckRequest,
  EmailCheckResponse,
  SSOAuthUrlResponse,
  SSOAuthResponse,
  SSOOnboardingRequest,
  SSOOnboardingResponse
} from './types'

class AuthApiClient {
  private baseClient = baseApiClient

  /**
   * Check if email already exists in the system
   */
  async checkEmail(email: string): Promise<ApiResponse<EmailCheckResponse>> {
    return this.baseClient.post<EmailCheckResponse>('/api/v1/auth/check-email', { email })
  }

  /**
   * Register a new user
   */
  async register(userData: UserCreate): Promise<ApiResponse<UserResponse>> {
    return this.baseClient.post<UserResponse>('/api/v1/auth/register', userData)
  }

  /**
   * Login user
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

  // Forgot password method removed since forgot password functionality is removed

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

  // SSO Methods

  /**
   * Get Google OAuth authorization URL
   */
  async getGoogleAuthUrl(state?: string): Promise<ApiResponse<SSOAuthUrlResponse>> {
    const params = state ? `?state=${encodeURIComponent(state)}` : ''
    return this.baseClient.get<SSOAuthUrlResponse>(`/api/v1/auth/google/auth-url${params}`)
  }

  /**
   * Get Microsoft OAuth authorization URL
   */
  async getMicrosoftAuthUrl(state?: string): Promise<ApiResponse<SSOAuthUrlResponse>> {
    const params = state ? `?state=${encodeURIComponent(state)}` : ''
    return this.baseClient.get<SSOAuthUrlResponse>(`/api/v1/auth/microsoft/auth-url${params}`)
  }

  /**
   * Get GitHub OAuth authorization URL
   */
  async getGitHubAuthUrl(state?: string): Promise<ApiResponse<SSOAuthUrlResponse>> {
    const params = state ? `?state=${encodeURIComponent(state)}` : ''
    return this.baseClient.get<SSOAuthUrlResponse>(`/api/v1/auth/github/auth-url${params}`)
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string, state?: string): Promise<ApiResponse<SSOAuthResponse>> {
    const params = new URLSearchParams({ code })
    if (state) params.append('state', state)
    return this.baseClient.get<SSOAuthResponse>(`/api/v1/auth/google/callback?${params.toString()}`)
  }

  /**
   * Handle Microsoft OAuth callback
   */
  async handleMicrosoftCallback(code: string, state?: string): Promise<ApiResponse<SSOAuthResponse>> {
    const params = new URLSearchParams({ code })
    if (state) params.append('state', state)
    return this.baseClient.get<SSOAuthResponse>(`/api/v1/auth/microsoft/callback?${params.toString()}`)
  }

  /**
   * Handle GitHub OAuth callback
   */
  async handleGitHubCallback(code: string, state?: string): Promise<ApiResponse<SSOAuthResponse>> {
    const params = new URLSearchParams({ code })
    if (state) params.append('state', state)
    return this.baseClient.get<SSOAuthResponse>(`/api/v1/auth/github/callback?${params.toString()}`)
  }

  /**
   * Complete SSO user onboarding
   */
  async onboardSSOUser(data: SSOOnboardingRequest): Promise<ApiResponse<SSOOnboardingResponse>> {
    return this.baseClient.post<SSOOnboardingResponse>('/api/v1/auth/sso/onboard', data)
  }
}

// Export singleton instance
export const authApi = new AuthApiClient()

// Export the class for custom instances
export { AuthApiClient }
