import React, { useState, useEffect, useRef } from 'react'
import { WelcomeStep, FullNameStep, ProfessionStep, PasswordStep, ForgotPasswordStep, ResetPasswordStep, OTPVerificationStep, SuccessStep } from './'
import { LogoOnly } from '@/icons/logo-only';
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { handleApiError } from '@/lib/error-handler'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/authSlice'
import { tokenManager } from '@/lib/token-manager'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSignupData } from '@/contexts/SignupDataContext'

interface MultiStepContainerProps {
  onComplete: (data: { email: string; fullName: string; profession: string }) => void
  initialEmail?: string
  initialPassword?: string
  initialFullName?: string
  isSSOOnboarding?: boolean
  initialStep?: Step
  className?: string
}

type Step = 'email' | 'welcome' | 'fullName' | 'profession' | 'password' | 'forgotPassword' | 'resetPassword' | 'otp' | 'success'

// Step order for determining navigation direction
const STEP_ORDER: Step[] = ['welcome', 'fullName', 'profession', 'password', 'forgotPassword', 'resetPassword', 'otp', 'success']

const STORAGE_KEY = 'signupFormData'

export const MultiStepContainer: React.FC<MultiStepContainerProps> = ({ 
  onComplete, 
  initialEmail = '',
  initialPassword = '',
  initialFullName = '',
  isSSOOnboarding = false,
  initialStep,
  className 
}) => {
  const dispatch = useAppDispatch()
  const { verifyOTP, register, regenerateOTP, updateProfile, completeOnboarding, getCurrentUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateData: updateSignupData } = useSignupData()
  
  // Get current step from query parameters, fallback to initialStep or default
  const getStepFromParams = (): Step => {
    const stepParam = searchParams.get('step')
    if (stepParam && ['welcome', 'fullName', 'profession', 'password', 'forgotPassword', 'resetPassword', 'otp', 'success'].includes(stepParam)) {
      // If step is 'otp' and we have email, return 'otp'
      // If step is 'otp' but no email, we still return 'otp' to show the step (email will be loaded)
      return stepParam as Step
    }
    return initialStep || (isSSOOnboarding ? 'welcome' : 'welcome')
  }
  
  // Make currentStep reactive to query parameter changes
  const [currentStep, setCurrentStep] = useState<Step>(() => getStepFromParams())
  const [previousStep, setPreviousStep] = useState<Step>(() => getStepFromParams())
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  
  // Update currentStep when query parameters change (browser back/forward)
  useEffect(() => {
    const stepParam = searchParams.get('step')
    const newStep: Step = stepParam && ['welcome', 'fullName', 'profession', 'password', 'forgotPassword', 'resetPassword', 'otp', 'success'].includes(stepParam)
      ? (stepParam as Step)
      : (initialStep || (isSSOOnboarding ? 'welcome' : 'welcome'))
    
    if (newStep !== currentStep) {
      setPreviousStep(currentStep)
      setCurrentStep(newStep)
    }
  }, [searchParams, initialStep, isSSOOnboarding, currentStep])
  
  // Initialize formData: first check state (SignupDataContext), then localStorage (midora_onboarding_data), then sessionStorage
  const initializeFormData = () => {
    if (typeof window !== 'undefined') {
      // First check SignupDataContext state (sessionStorage with key 'signupData')
      const stateStored = sessionStorage.getItem('signupData')
      let parsedData: Partial<{
        email: string
        fullName: string
        profession: string
        password: string
        selectedTopics: string[]
        otherTopicsInput: string
      }> | null = null
      
      if (stateStored) {
        try {
          parsedData = JSON.parse(stateStored)
          console.log('[MultiStep] Loaded from state (signupData):', parsedData)
        } catch (error) {
          console.error('Error parsing state data:', error)
        }
      }
      
      // If no data in state, check localStorage (midora_onboarding_data)
      if (!parsedData || (!parsedData.email && !parsedData.fullName && !parsedData.profession)) {
        const localStorageStored = localStorage.getItem('midora_onboarding_data')
        if (localStorageStored) {
          try {
            parsedData = JSON.parse(localStorageStored)
            console.log('[MultiStep] Loaded from localStorage (midora_onboarding_data):', parsedData)
          } catch (error) {
            console.error('Error parsing localStorage data:', error)
          }
        }
      }
      
      // If still no data, check sessionStorage (signupFormData)
      if (!parsedData || (!parsedData.email && !parsedData.fullName && !parsedData.profession)) {
        const sessionStored = sessionStorage.getItem(STORAGE_KEY)
        if (sessionStored) {
          try {
            parsedData = JSON.parse(sessionStored)
            console.log('[MultiStep] Loaded from sessionStorage (signupFormData):', parsedData)
          } catch (error) {
            console.error('Error parsing sessionStorage data:', error)
          }
        }
      }
      
      if (parsedData) {
        return {
          email: parsedData.email || initialEmail,
          fullName: parsedData.fullName || initialFullName,
          profession: parsedData.profession || '',
          password: parsedData.password || initialPassword,
          selectedTopics: parsedData.selectedTopics || [],
          otherTopicsInput: parsedData.otherTopicsInput || ''
        }
      }
    }
    return {
      email: initialEmail,
      fullName: initialFullName,
      profession: '',
      password: initialPassword,
      selectedTopics: [] as string[],
      otherTopicsInput: ''
    }
  }
  
  const [formData, setFormData] = useState(initializeFormData)
  const [resetPasswordEmail, setResetPasswordEmail] = useState('')
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const isOtpEmailSend = useRef(false)
  
  // Persist formData to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      // Also sync with SignupDataContext
      updateSignupData({
        email: formData.email,
        fullName: formData.fullName,
        profession: formData.profession,
        password: formData.password,
        selectedTopics: formData.selectedTopics,
        otherTopicsInput: formData.otherTopicsInput
      })
    }
  }, [formData, updateSignupData])
  
  // Restore formData when navigating back/forward (step changes)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsedData = JSON.parse(stored)
          setFormData(prev => ({
            email: parsedData.email || prev.email,
            fullName: parsedData.fullName || prev.fullName,
            profession: parsedData.profession || prev.profession,
            password: parsedData.password || prev.password,
            selectedTopics: parsedData.selectedTopics || prev.selectedTopics,
            otherTopicsInput: parsedData.otherTopicsInput || prev.otherTopicsInput
          }))
        } catch (error) {
          console.error('Error parsing stored form data on step change:', error)
        }
      }
    }
  }, [currentStep])
  
  // Helper function to navigate to a step using query parameters
  const navigateToStep = (step: Step, direction: 'left' | 'right' = 'right') => {
    setSlideDirection(direction)
    setPreviousStep(currentStep)
    const params = new URLSearchParams(searchParams.toString())
    params.set('step', step)
    // Use replace: false to allow browser history
    router.push(`/signup?${params.toString()}`, { scroll: false })
  }
  
  // Determine slide direction based on step order
  useEffect(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    const prevIndex = STEP_ORDER.indexOf(previousStep)
    
    if (currentIndex > prevIndex && currentIndex !== -1 && prevIndex !== -1) {
      setSlideDirection('right')
    } else if (currentIndex < prevIndex && currentIndex !== -1 && prevIndex !== -1) {
      setSlideDirection('left')
    }
  }, [currentStep, previousStep])

  const handleEmailSubmit = (email: string) => {
    // If email is different from stored email, reset all other fields (new signup attempt)
    setFormData(prev => {
      if (prev.email && prev.email !== email) {
        // New email detected - reset all fields except email
        const resetData = {
          email: email,
          fullName: '',
          profession: '',
          password: '',
          selectedTopics: [],
          otherTopicsInput: ''
        }
        // Clear sessionStorage, localStorage and update SignupDataContext
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resetData))
          try {
            localStorage.removeItem('midora_onboarding_data')
            sessionStorage.removeItem('signupData')
          } catch (error) {
            console.error('Error clearing storage:', error)
          }
          updateSignupData(resetData)
        }
        return resetData
      }
      // Same email or first time - just update email
      return { ...prev, email }
    })
    navigateToStep('welcome', 'right')
  }

  const handleWelcomeNext = () => {
    navigateToStep('fullName', 'right')
  }

  const handleFullNameNext = (fullName: string) => {
    setFormData(prev => ({ ...prev, fullName }))
    navigateToStep('profession', 'right')
  }

  const handleFullNameBack = () => {
    navigateToStep('welcome', 'left')
  }

  const handleProfessionNext = (topics: string[], rawSelectedTopics: string[], otherInput?: string) => {
    const profession = topics.join(', ')
    setFormData(prev => ({ 
      ...prev, 
      profession,
      selectedTopics: rawSelectedTopics,
      otherTopicsInput: otherInput || ''
    }))
    
    if (isSSOOnboarding) {
      // For SSO onboarding, go directly to success screen
      navigateToStep('success', 'right')
    } else {
      // For regular onboarding, go to password step
      navigateToStep('password', 'right')
    }
  }

  const handleProfessionBack = () => {
    navigateToStep('fullName', 'left')
  }

  const handlePasswordNext = async (password: string) => {
    setFormData(prev => ({ ...prev, password }))
    
    try {
      const nameParts = formData.fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      await register({
        email: formData.email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        meta_data: {
          profession: formData.profession
        }
      })

      showSuccessToast('Registration Successful', 'Please check your email for OTP verification')
      navigateToStep('otp', 'right')
    } catch (err: any) {
      console.error('Registration error:', err)
      showErrorToast('Registration Failed', handleApiError(err))
    }
  }

  const handlePasswordBack = () => {
    navigateToStep('profession', 'left')
  }

  const handleForgotPasswordBack = () => {
    // Navigate back to the signup form (no step parameter)
    router.push('/signup', { scroll: false })
  }

  const handleForgotPasswordNext = (email: string) => {
    setResetPasswordEmail(email)
    navigateToStep('resetPassword', 'right')
  }

  const handleResetPasswordBack = () => {
    navigateToStep('forgotPassword', 'left')
  }

  const handleOTPNext = async (otpCode: string) => {
    try {
      await verifyOTP({
        email: formData.email,
        otp_code: otpCode
      })

      showSuccessToast('Email Verified', 'Welcome to Midora!')
      navigateToStep('success', 'right')
    } catch (err: any) {
      console.error('OTP verification error:', err)
      showErrorToast('OTP Verification Failed', handleApiError(err))
      throw err
    }
  }

  const handleOTPBack = () => {
    navigateToStep('password', 'left')
  }

  const handleOTPRegenerate = async () => {
    try {
      await regenerateOTP(formData.email)
      showSuccessToast('OTP Sent', 'A new OTP has been sent to your email')
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
        
        // Complete onboarding with profile data
        await completeOnboarding({
          first_name: firstName,
          last_name: lastName,
          profession: [formData.profession]
        })
        
        // Get updated user data and store in Redux
        const userData = await getCurrentUser()
        if (userData) {
          const tokens = tokenManager.getTokens()
          dispatch(loginSuccess({
            user: userData,
            accessToken: tokens.accessToken!,
            refreshToken: tokens.refreshToken!,
            authMethod: (tokens.authMethod as 'email' | 'google' | 'microsoft' | 'github') || 'email'
          }))
        }
        
        router.push('/chat')
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
              initialName={formData.fullName}
            />
          </div>
        )
      case 'profession':
        return (
          <div key="profession" className={`${baseClasses} ${slideClasses}`}>
            <ProfessionStep 
              onNext={handleProfessionNext} 
              onBack={handleProfessionBack}
              initialSelectedTopics={formData.selectedTopics}
              initialOtherInput={formData.otherTopicsInput}
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
      case 'forgotPassword':
        return (
          <div key="forgotPassword" className={`${baseClasses} ${slideClasses}`}>
            <ForgotPasswordStep 
              onBack={handleForgotPasswordBack}
              onNext={handleForgotPasswordNext}
            />
          </div>
        )
      case 'resetPassword':
        return (
          <div key="resetPassword" className={`${baseClasses} ${slideClasses}`}>
            <ResetPasswordStep 
              email={resetPasswordEmail}
              onBack={handleResetPasswordBack}
            />
          </div>
        )
      case 'otp':
        // Ensure email is available for OTP step
        const otpEmail = formData.email || initialEmail || ''
        if (!otpEmail) {
          // If no email, try to load from storage
          if (typeof window !== 'undefined') {
            const storedData = sessionStorage.getItem('signupData') || localStorage.getItem('midora_onboarding_data')
            if (storedData) {
              try {
                const parsed = JSON.parse(storedData)
                if (parsed.email) {
                  // Update formData with email
                  setFormData(prev => ({ ...prev, email: parsed.email }))
                  updateSignupData({ email: parsed.email })
                }
              } catch (error) {
                console.error('Error parsing stored data for OTP:', error)
              }
            }
          }
        }
        return (
          <div key="otp" className={`${baseClasses} transform translate-x-0 opacity-100`}>
            <OTPVerificationStep 
              onNext={handleOTPNext} 
              onBack={handleOTPBack}
              onRegenerateOTP={handleOTPRegenerate}
              email={formData.email || initialEmail || ''}
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
    if (currentStep === "otp" && formData.email && !isOtpEmailSend.current) {
      isOtpEmailSend.current = true
      regenerateOTP(formData.email)
    }
  }, [currentStep, formData.email, regenerateOTP])

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
  
  // Update previous step when current step changes (for browser navigation)
  useEffect(() => {
    if (currentStep !== previousStep) {
      setPreviousStep(currentStep)
    }
  }, [currentStep])

  return (
    <div className={`relative overflow-hidden h-full ${className}`}>
      <div className="relative w-full h-full flex flex-col">
        <div className="flex-1 flex justify-center">
          {getStepComponent()}
        </div>
      </div>
    </div>
  )
}
