/**
 * Common authentication utilities
 * Handles token management and authentication flows
 */

import { authApi } from '@/api/auth/api'
import { setAuthTokens } from './cookies'
import { handleApiError } from './error-handler'

/**
 * Common function to handle successful authentication
 * Saves tokens and redirects to chat page
 */
export async function handleSuccessfulAuth(
  email: string,
  password: string,
  router: any
): Promise<void> {
  try {
    // Login with email and password
    const response = await authApi.login({ email, password })
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    if (response.data) {
      // Save tokens to cookies
      setAuthTokens(response.data.access_token, response.data.refresh_token)
      
      // Redirect to chat page
      router.push('/chat')
    }
  } catch (error: any) {
    const errorMessage = handleApiError(error)
    throw new Error(errorMessage)
  }
}

/**
 * Handle OTP verification and redirect to login page
 * After successful OTP verification, redirect user to login page instead of auto-login
 * @deprecated Use useOTPLogin hook instead for better state management
 */
export async function handleOTPVerificationAndLogin(
  email: string,
  password: string,
  otpCode: string,
  router: any
): Promise<void> {
  try {
    // First verify OTP
    const verifyResponse = await authApi.verifyOTP({
      email,
      otp_code: otpCode
    })
    
    if (verifyResponse.error) {
      throw new Error(verifyResponse.error)
    }
    
    // After successful OTP verification, redirect to login page
    // Pass email as query parameter for pre-filling
    router.push(`/login?email=${encodeURIComponent(email)}`)
  } catch (error: any) {
    const errorMessage = handleApiError(error)
    throw new Error(errorMessage)
  }
}
