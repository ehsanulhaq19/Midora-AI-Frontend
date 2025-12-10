'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { ButtonGroup } from './button-group'
import { Buttons } from '../ui'
import { CaretDown } from '@/icons'
import { t } from '@/i18n'
import { useSignupData } from '@/contexts/SignupDataContext'
import { EmailInput } from '@/components/ui/inputs/email-input'
import { LoginPasswordInput } from '@/components/ui/inputs/login-password-input'
import { authApi } from '@/api/auth/api'
import { handleApiError } from '@/lib/error-handler'
import { useAuth } from '@/hooks/use-auth'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { tokenManager } from '@/lib/token-manager'
import { setTokens } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from '@/hooks/use-theme'

interface SignupFormSectionProps {
  className?: string
  onShowOnboarding?: (step?: string) => void
}

export const SignupFormSection: React.FC<SignupFormSectionProps> = ({ className, onShowOnboarding }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { data: currentSignupData, updateData } = useSignupData()
  const { 
    login, 
    isLoading: isLoggingIn, 
    error: loginError, 
    clearError: clearLoginError,
    signInWithGoogle, 
    signInWithMicrosoft, 
    signInWithGitHub 
  } = useAuth()
  const { error: showErrorToast, success: showSuccessToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isProcessingSSO, setIsProcessingSSO] = useState(false)

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'))
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError(t('auth.validEmailRequired'))
      return
    }
    
    setIsCheckingEmail(true)
    setEmailError('')
    
    try {
      // Check if email already exists
      const response = await authApi.checkEmail(email)
      
      if (response.error) {
        const errorMessage = handleApiError(response)
        showErrorToast('Email Check Failed', errorMessage)
        return
      }
      
      if (response.data?.exists) {
        // Email exists, transition to password field
        setIsTransitioning(true)
        setTimeout(() => {
          setShowPasswordField(true)
          setIsTransitioning(false)
        }, 300) // Match the transition duration
        return
      }
      
      // Check if this is a new email (different from stored email)
      // If so, clear all other signup data to start fresh
      if (currentSignupData?.email && currentSignupData.email !== email) {
        // New email detected - reset all fields except email
        const resetData = {
          email: email,
          fullName: '',
          profession: '',
          password: '',
          selectedTopics: [],
          otherTopicsInput: ''
        }
        updateData(resetData)
        // Also clear localStorage and sessionStorage to prevent stale data
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('midora_onboarding_data')
            sessionStorage.removeItem('signupFormData')
            sessionStorage.removeItem('signupData')
          } catch (error) {
            console.error('Error clearing storage:', error)
          }
        }
      } else {
        // Same email or first time - just update email
        updateData({ email })
      }
      
      // Show onboarding flow via callback
      if (onShowOnboarding) {
        onShowOnboarding()
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      showErrorToast('Email Verification Failed', errorMessage)
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handlePasswordSubmit = useCallback(async () => {
    if (!password.trim()) {
      setPasswordError(t('auth.passwordRequired'))
      return
    }
    
    setPasswordError('')
    // clearLoginError()
    
    try {
      await login({ email, password })
    } catch (err: any) {
      const errorObject = JSON.parse(err.message)
      
      if (errorObject && errorObject.error_type === 'NOT_VERIFIED_USER') {
        updateData({ email, password })
        
        if (onShowOnboarding) {
          onShowOnboarding('otp')
        }
        return
      } else {
        const errorMessage = handleApiError(errorObject)
        showErrorToast('Login Failed', errorMessage)
      }
    }
  }, [password, email, login, clearLoginError, updateData, showErrorToast])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError('')
    if (loginError) clearLoginError()
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError) setPasswordError('')
    if (loginError) clearLoginError()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showPasswordField) {
        handlePasswordSubmit()
      } else {
        handleEmailSubmit()
      }
    }
  }

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className={`flex flex-col w-full max-w-[408px] items-center gap-12 lg:gap-[197px] ${className}`}>
      <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
        <p className="relative w-full max-w-[232px] mt-[-1.00px] font-h02-heading02 font-normal text-[color:var(--tokens-color-text-text-seconary)] text-3xl sm:text-4xl text-center tracking-[-1.80px] leading-9">
          <span className="tracking-[var(--h03-heading03-light-letter-spacing)] [font-family:'Poppins',Helvetica] [font-style:var(--h03-heading-light-font-family)] font-[number:var(--h03-heading-light-font-weight)] leading-[var(--h03-heading-light-line-height)] text-[length:var(--h03-heading-light-font-size)]">
            All your AI. <br />
          </span>

          <span className="tracking-[var(--h02-heading02-letter-spacing)] [font-family:'Poppins',Helvetica] [font-style:var(--h02-heading02-font-style)] font-[number:var(--h02-heading02-font-weight)] leading-[var(--h02-heading02-line-height)] text-[length:var(--h02-heading02-font-size)]">
            One gateway
          </span>

          <span className="tracking-[-0.65px]">.</span>
        </p>

        <div className="flex flex-col items-center gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] bg-[color:var(--tokens-color-surface-surface-primary)] rounded-3xl shadow-purple-soft">
          <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
            <div className="flex flex-row flex-wrap  sm:flex-nowrap justify-start items-center  gap-3 relative self-stretch w-full flex-[0_0_auto]">
             <button 
                type="button"
                 className={`inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] rounded-xl border border-solid border-[#dbdbdb] hover:border-[#bbb]  ${
                  isDark ? 'dark:border-white/20 dark:hover:border-white/30' : ''
                }  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={signInWithGitHub}
                disabled={isProcessingSSO}
                aria-label="Sign up with Github"
              >
                <img
                  className="relative w-6 h-6 aspect-[1]"
                  alt="Github"
                  src="/img/github.png"
                />

                <span className="relative hidden lg:block font-SF-Pro w-fit font-normal text-[color:var(--tokens-color-text-text-primary)] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap">
                  Github
                </span>
              </button>

              <button 
                type="button"
                className={`inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] rounded-xl border border-solid border-[#dbdbdb] hover:border-[#bbb]  ${
                  isDark ? 'dark:border-white/20 dark:hover:border-white/30' : ''
                }  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={signInWithMicrosoft}
                disabled={isProcessingSSO}
                aria-label="Sign up with Microsoft"
              >
                <img
                  className="relative w-6 h-6 aspect-[1]"
                  alt="Microsoft"
                  src="/img/microsoft.png"
                />

                <span className="relative hidden lg:block font-SF-Pro w-fit font-normal text-[color:var(--tokens-color-text-text-primary)] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap">
                  Microsoft
                </span>
              </button>

              <button 
                type="button"
                className={`inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] rounded-xl border border-solid border-[#dbdbdb] hover:border-[#bbb]  ${
                  isDark ? 'dark:border-white/20 dark:hover:border-white/30' : ''
                }  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={signInWithGoogle}
                disabled={isProcessingSSO}
                aria-label="Sign up with Google"
              >
                <img
                  className="relative w-6 h-6 aspect-[1] object-cover"
                  alt="Google"
                  src="/img/image-6.png"
                />

                <span className="relative  hidden lg:block font-SF-Pro w-fit font-normal text-[color:var(--tokens-color-text-text-primary)] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap">
                  Google
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <img
              className="relative flex-1 grow h-px object-cover"
              alt="Line"
              src="/img/line-2.svg"
            />

            <div className="relative w-fit font-SF-Pro font-normal text-[color:var(--tokens-color-text-text-inactive-2)] text-[16px] tracking-[0] leading-[100%] whitespace-nowrap">
              OR
            </div>

            <img
              className="relative flex-1 grow h-px object-cover"
              alt="Line"
              src="/img/line-1.svg"
            />
          </div>

          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            {/* Email Field */}
            {!showPasswordField && (
              <div className={`transition-all duration-300 ease-in-out w-full ${
                isTransitioning 
                  ? 'opacity-0 transform -translate-y-2' 
                  : 'opacity-100 transform translate-y-0'
              }`}>
                <EmailInput
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  error={emailError}
                  disabled={isCheckingEmail || isTransitioning}
                  placeholder="Enter your personal or work email"
                />
                <div className='flex justify-end w-full'>
                <button
                  type="button"
                  onClick={() => {
                    if (onShowOnboarding) {
                      onShowOnboarding('forgotPassword')
                    }
                  }}
                  className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]  mt-4 hover:text-[color:var(--tokens-color-text-text-primary)] block transition-colors duration-200 cursor-pointer text-right"
                >
                  forgot password ?
                </button>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className={`transition-all duration-300 ease-in-out w-full ${
              showPasswordField 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-2 pointer-events-none absolute'
            }`}>
              <LoginPasswordInput
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                error={passwordError}
                disabled={isLoggingIn}
                placeholder="Enter your password"
              />
              
            </div>

            {/* Submit Button */}
            <div className={`transition-all duration-300 ease-in-out w-full ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
              <Buttons 
                property1="pressed" 
                className='mt-4'
                onClick={showPasswordField ? handlePasswordSubmit : handleEmailSubmit}
                text={
                  isProcessingSSO 
                    ? t('auth.ssoSigningIn').replace('{provider}', 'SSO')
                    : showPasswordField 
                      ? (isLoggingIn ? t('auth.loggingIn') : t('auth.loginWithPassword'))
                      : (isCheckingEmail ? "Checking..." : "Continue with email")
                }
                disabled={isCheckingEmail || isLoggingIn || isTransitioning || isProcessingSSO}
              />
            </div>
          </div>

          <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto]">
            <p className="relative w-fit font-SF-Pro font-normal text-transparent text-sm text-center tracking-[0] leading-[100%]">
              <span className="text-[color:var(--tokens-color-text-text-inactive-2)]">
                By continuing, you acknowledge our{" "}
              </span>

              <a 
                href="/privacy-policy" 
                className="text-[color:var(--tokens-color-text-text-primary)] underline leading-[100%] tracking-[0] text-center hover:opacity-80 transition-colors duration-200 underline-offset-0 decoration-[0px] focus:outline-none focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-primary)] focus:ring-offset-2 rounded"
                aria-label="Read our Privacy Policy"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="border-[unset] rounded-[var(--premitives-corner-radius-corner-radius-3)] flex-[0_0_auto] bg-tokens-color-surface-surface-button-inactive hover:bg-opacity-80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 inline-flex items-center gap-1.5 px-3 py-1.5"
        onClick={() => {}}
        aria-label="Learn more about our features"
      >
        <span className="text-[color:var(--tokens-color-text-text-brand)] tracking-[-0.70px] text-xs font-normal [font-family:'Poppins',Helvetica] ">
          Learn More
        </span>
        <CaretDown
          className="relative w-5 h-5"
          color="#1F1740"
          opacity="0.9"
        />
      </button>
    </div>
  )
}
