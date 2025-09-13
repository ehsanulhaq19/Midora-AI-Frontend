'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OTPVerificationStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'
import { authApi } from '@/api/auth/api'
import { handleApiError } from '@/lib/error-handler'
import { useOTPLogin } from '@/hooks/useOTPLogin'
import { useLogin } from '@/hooks/useLogin'

export default function OTPVerificationPage() {
  const router = useRouter()
  const { data } = useSignupData()
  const { verifyOTPAndLogin, isLoading: isVerifyingOTP, error: otpError, clearError: clearOTPError } = useOTPLogin()
  const { login, isLoading: isLoggingIn, error: loginError, clearError: clearLoginError } = useLogin()
  const [isRegistering, setIsRegistering] = useState(false)

  React.useEffect(() => {
    if (!data.email || !data.fullName || !data.profession || !data.password) {
      router.push('/signup')
    }
  }, [data, router])

  const handleNext = async (otpCode: string) => {
    if (isRegistering || isVerifyingOTP) return
    
    setIsRegistering(true)
    clearOTPError()
    
    try {
      // Use the custom OTP login hook
      await verifyOTPAndLogin(
        data.email,
        data.password,
        otpCode
      )
      
    } catch (error: any) {
      console.error('OTP verification failed:', error)
      throw error // Re-throw to let the component handle the error display
    } finally {
      setIsRegistering(false)
      handleLogin(data.email, data.password)
    }
  }


  const handleLogin = async (email: string, password: string) => {
    if (isLoggingIn) return
    clearLoginError()
    await login(email, password)
  }

  const handleBack = () => {
    router.push('/signup/password')
  }

  const handleRegenerateOTP = async () => {
    try {
      const response = await authApi.regenerateOTP(data.email)
      if (response.error) {
        throw new Error(response.error)
      }
    } catch (error: any) {
      console.error('Failed to regenerate OTP:', error)
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  }

  return (
    <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8 h-full">
      <div className="w-full max-w-[450px]">
        <OTPVerificationStep 
          onNext={handleNext} 
          onBack={handleBack}
          onRegenerateOTP={handleRegenerateOTP}
          email={data.email}
          isLoading={isRegistering || isVerifyingOTP}
        />
      </div>
    </main>
  )
}
