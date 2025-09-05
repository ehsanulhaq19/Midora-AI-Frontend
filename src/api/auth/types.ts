/**
 * Authentication API types
 * Type definitions for all authentication-related API requests and responses
 */

// User types
export interface User {
  email: string
  first_name: string
  last_name: string
  uuid: string
  username: string
  is_active: boolean
  is_verified: boolean
}

// Authentication request types
export interface UserLogin {
  email: string
  password: string
}

export interface UserCreate {
  email: string
  first_name: string
  last_name: string
  password: string
}


// Authentication response types
export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserResponse {
  email: string
  first_name: string
  last_name: string
  uuid: string
  username: string
  is_active: boolean
  is_verified: boolean
}

// Password reset types
export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  email: string
}

export interface PasswordResetRequest {
  email: string
  otp_code: string
  new_password: string
}

export interface PasswordResetResponse {
  message: string
  email: string
}

// OTP verification types
export interface OTPVerificationRequest {
  email: string
  otp_code: string
}

export interface OTPVerificationResponse {
  message: string
  user_uuid: string
  email: string
}

export interface OTPRegenerationRequest {
  email: string
}

export interface OTPRegenerationResponse {
  message: string
  email: string
}

// Form data types for components
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  first_name: string
  last_name: string
  password: string
  confirmPassword: string
}

// Backend response types
export interface BackendSuccessResponse<T = any> {
  success: true
  data: T
}

export interface BackendErrorResponse {
  success: false
  error_type: string
  error_message: string
}

export type BackendResponse<T = any> = BackendSuccessResponse<T> | BackendErrorResponse

// API error types (legacy - keeping for backward compatibility)
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

// Token validation types
export interface TokenPayload {
  sub: string // user ID
  email: string
  exp: number
  iat: number
  jti?: string
}

// Authentication state types
export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Authentication context types
export interface AuthContextType extends AuthState {
  login: (credentials: UserLogin) => Promise<void>
  register: (userData: UserCreate) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<string>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (data: PasswordResetRequest) => Promise<void>
  verifyOTP: (data: OTPVerificationRequest) => Promise<void>
  regenerateOTP: (email: string) => Promise<void>
  clearError: () => void
}

// Authentication hook types
export interface UseAuthReturn {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: UserLogin) => Promise<void>
  register: (userData: UserCreate) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (data: PasswordResetRequest) => Promise<void>
  verifyOTP: (data: OTPVerificationRequest) => Promise<void>
  regenerateOTP: (email: string) => Promise<void>
  clearError: () => void
}
