import React, { useState, useEffect } from 'react'
import { WelcomeStep, FullNameStep, ProfessionStep, PasswordStep, OTPVerificationStep, SuccessStep } from './'
import { LogoOnly } from '@/icons/logo-only';
import { authApi } from '@/api/auth/api'
import { useToast } from '@/hooks/useToast'
import { handleApiError } from '@/lib/error-handler'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/authSlice'
import { tokenManager } from '@/lib/token-manager'

interface MultiStepContainerProps {
  onComplete: (data: { email: string; fullName: string; profession: string }) => void
  initialEmail?: string
  initialFullName?: string
  isSSOOnboarding?: boolean
  className?: string
}

type Step = 'email' | 'welcome' | 'fullName' | 'profession' | 'password' | 'otp' | 'success'

export const MultiStepContainer: React.FC<MultiStepContainerProps> = ({ 
  onComplete, 
  initialEmail = '',
  initialFullName = '',
  isSSOOnboarding = false,
  className 
}) => {
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState<Step>(isSSOOnboarding ? 'welcome' : 'welcome')
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [formData, setFormData] = useState({
    email: initialEmail,
    fullName: initialFullName,
    profession: '',
    password: ''
  })
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  const handleEmailSubmit = (email: string) => {
    setFormData(prev => ({ ...prev, email }))
    setSlideDirection('right')
    setCurrentStep('welcome')
  }

  const handleWelcomeNext = () => {
    setSlideDirection('right')
    setCurrentStep('fullName')
  }

  const handleFullNameNext = (fullName: string) => {
    setFormData(prev => ({ ...prev, fullName }))
    setSlideDirection('right')
    setCurrentStep('profession')
  }

  const handleFullNameBack = () => {
    setSlideDirection('left')
    setCurrentStep('welcome')
  }

  const handleProfessionNext = (profession: string) => {
    setFormData(prev => ({ ...prev, profession }))
    
    if (isSSOOnboarding) {
      // For SSO onboarding, go directly to success screen
      setSlideDirection('right')
      setCurrentStep('success')
    } else {
      // For regular onboarding, go to password step
      setSlideDirection('right')
      setCurrentStep('password')
    }
  }

  const handleProfessionBack = () => {
    setSlideDirection('left')
    setCurrentStep('fullName')
  }

  const handlePasswordNext = async (password: string) => {
    setFormData(prev => ({ ...prev, password }))
    
    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Call register API
      const response = await authApi.register({
        email: formData.email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        meta_data: {
          profession: formData.profession
        }
      })

      if (response.success) {
        showSuccessToast('Registration Successful', 'Please check your email for OTP verification')
        setSlideDirection('right')
        setCurrentStep('otp')
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      showErrorToast('Registration Failed', handleApiError(err))
    }
  }

  const handlePasswordBack = () => {
    setSlideDirection('left')
    setCurrentStep('profession')
  }

  const handleOTPNext = async (otpCode: string) => {
    try {
      const response = await authApi.verifyOTP({
        email: formData.email,
        otp_code: otpCode
      })

      if (response.success) {
        showSuccessToast('Email Verified', 'Welcome to Midora!')
        setSlideDirection('right')
        setCurrentStep('success')
      } else {
        throw new Error(response.error || 'OTP verification failed')
      }
    } catch (err: any) {
      console.error('OTP verification error:', err)
      showErrorToast('OTP Verification Failed', handleApiError(err))
      throw err // Re-throw to let OTP component handle the error
    }
  }

  const handleOTPBack = () => {
    setSlideDirection('left')
    setCurrentStep('password')
  }

  const handleOTPRegenerate = async () => {
    try {
      const response = await authApi.regenerateOTP(formData.email)
      
      if (response.success) {
        showSuccessToast('OTP Sent', 'A new OTP has been sent to your email')
      } else {
        throw new Error(response.error || 'Failed to regenerate OTP')
      }
    } catch (err: any) {
      console.error('OTP regeneration error:', err)
      showErrorToast('Failed to Resend OTP', handleApiError(err))
      throw err // Re-throw to let OTP component handle the error
    }
  }

  const handleSuccessNext = async () => {
    if (isSSOOnboarding) {
      // For SSO onboarding, update profile and complete onboarding
      try {
        const [firstName, ...lastNameParts] = formData.fullName.split(' ')
        const lastName = lastNameParts.join(' ')
        
        const response = await authApi.updateProfile({
          first_name: firstName,
          last_name: lastName,
          profession: formData.profession
        })

        if (response.success) {
          // Complete onboarding
          const completeResponse = await authApi.completeOnboarding()
          
          if (completeResponse.success) {
            // Get updated user data and store in Redux
            const userResponse = await authApi.getCurrentUser()
            if (userResponse.data) {
              const tokens = tokenManager.getTokens()
              dispatch(loginSuccess({
                user: userResponse.data,
                accessToken: tokens.accessToken!,
                refreshToken: tokens.refreshToken!,
                authMethod: (tokens.authMethod as 'email' | 'google' | 'microsoft' | 'github') || 'email'
              }))
            }
            
            showSuccessToast('Profile Complete', 'Welcome to Midora!')
            // Redirect to chat
            window.location.href = '/chat'
          } else {
            throw new Error(completeResponse.error || 'Failed to complete onboarding')
          }
        } else {
          throw new Error(response.error || 'Failed to update profile')
        }
      } catch (err: any) {
        console.error('SSO onboarding completion error:', err)
        showErrorToast('Onboarding Failed', handleApiError(err))
      }
    } else {
      // For regular onboarding, complete the flow
      onComplete({ 
        email: formData.email, 
        fullName: formData.fullName, 
        profession: formData.profession 
      })
    }
  }

  const getStepComponent = () => {
    const baseClasses = "w-full max-w-[408px] transition-transform duration-500 ease-in-out"
    const slideClasses = slideDirection === 'right' 
      ? "transform translate-x-full opacity-0" 
      : "transform -translate-x-full opacity-0"
    
    switch (currentStep) {
      case 'welcome':
        return (
          <div key="welcome" className={`${baseClasses} ${slideClasses}`}>
            <WelcomeStep onNext={handleWelcomeNext} />
          </div>
        )
      case 'fullName':
        return (
          <div key="fullName" className={`${baseClasses} ${slideClasses}`}>
            <FullNameStep 
              onNext={handleFullNameNext} 
              onBack={handleFullNameBack}
            />
          </div>
        )
      case 'profession':
        return (
          <div key="profession" className={`${baseClasses} ${slideClasses}`}>
            <ProfessionStep 
              onNext={handleProfessionNext} 
              onBack={handleProfessionBack}
            />
          </div>
        )
      case 'password':
        return (
          <div key="password" className={`${baseClasses} ${slideClasses}`}>
            <PasswordStep 
              onNext={handlePasswordNext} 
              onBack={handlePasswordBack}
            />
          </div>
        )
      case 'otp':
        return (
          <div key="otp" className={`${baseClasses} ${slideClasses}`}>
            <OTPVerificationStep 
              onNext={handleOTPNext} 
              onBack={handleOTPBack}
              onRegenerateOTP={handleOTPRegenerate}
              email={formData.email}
            />
          </div>
        )
      case 'success':
        return (
          <div key="success" className={`${baseClasses} ${slideClasses}`}>
            <SuccessStep 
              onNext={handleSuccessNext} 
              email={formData.email}
              password={formData.password}
              isSSOOnboarding={isSSOOnboarding}
            />
          </div>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.querySelector('.w-full.max-w-\\[408px\\].transition-transform')
      if (element) {
        element.classList.remove('translate-x-full', '-translate-x-full', 'opacity-0')
        element.classList.add('translate-x-0', 'opacity-100')
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <div className="relative w-full h-full flex flex-col">
        <div className="flex-1 flex justify-center">
          {getStepComponent()}
        </div>
      </div>
    </div>
  )
}
