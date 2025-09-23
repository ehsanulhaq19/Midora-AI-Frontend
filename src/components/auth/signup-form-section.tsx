'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { ButtonGroup } from './button-group'
import { Buttons } from '../ui'
import { CaretDown } from '@/icons'
import { t } from '@/i18n'
import { useSignupData } from '@/contexts/signup-context'
import { EmailInput } from '@/components/ui/inputs/email-input'
import { LoginPasswordInput } from '@/components/ui/inputs/login-password-input'
import { authApi } from '@/api/auth/api'
import { handleApiError } from '@/lib/error-handler'
import { useLogin } from '@/hooks/useLogin'
import { useSSO } from '@/hooks/useSSO'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { tokenManager } from '@/lib/token-manager'

interface SignupFormSectionProps {
  className?: string
}

export const SignupFormSection: React.FC<SignupFormSectionProps> = ({ className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { updateData } = useSignupData()
  const { login, isLoading: isLoggingIn, error: loginError, clearError: clearLoginError } = useLogin()
  const { signInWithGoogle, signInWithMicrosoft, signInWithGitHub } = useSSO()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isProcessingSSO, setIsProcessingSSO] = useState(false)

  // Handle SSO callback with tokens in query parameters
  useEffect(() => {
    const processSSOCallback = async () => {
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      const authMethod = searchParams.get('auth_method')
      const error = searchParams.get('error')
      const errorMessage = searchParams.get('message')

      // Handle SSO error
      if (error) {
        console.error('SSO Error:', errorMessage)
        setEmailError(errorMessage || t('auth.ssoError'))
        
        // Remove error query params
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('error')
        newUrl.searchParams.delete('message')
        window.history.replaceState({}, '', newUrl.toString())
        return
      }

      // Process SSO success with tokens
      if (accessToken && refreshToken && authMethod) {
        setIsProcessingSSO(true)
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
          // Store tokens using token manager
          tokenManager.storeTokens(accessToken, refreshToken, authMethod)

          // Get user details from backend
          const userResponse = await authApi.getCurrentUser()
          
          if (userResponse.data) {
            // Store auth data in Redux
            dispatch(loginSuccess({
              user: userResponse.data,
              accessToken,
              refreshToken,
              authMethod: authMethod as 'google' | 'microsoft' | 'github'
            }))

            // Remove query params
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('access_token')
            newUrl.searchParams.delete('refresh_token')
            newUrl.searchParams.delete('auth_method')
            window.history.replaceState({}, '', newUrl.toString())

            // Redirect to chat page
            router.push('/chat')
          } else {
            throw new Error('Failed to get user information')
          }
        } catch (err: any) {
          console.error('SSO callback processing error:', err)
          
          // Clear tokens on error
          tokenManager.clearTokens()
          
          // Remove query params
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('access_token')
          newUrl.searchParams.delete('refresh_token')
          newUrl.searchParams.delete('auth_method')
          window.history.replaceState({}, '', newUrl.toString())
          
          // Show error
          const errorMessage = handleApiError(err)
          setEmailError(errorMessage)
          dispatch(setError(errorMessage))
        } finally {
          setIsProcessingSSO(false)
          dispatch(setLoading(false))
        }
      }
    }

    // Only run if there are relevant search params
    if (searchParams.has('access_token') || searchParams.has('error')) {
      processSSOCallback().catch((error) => {
        console.error('SSO callback error:', error)
        dispatch(setError('SSO authentication failed'))
        dispatch(setLoading(false))
      })
    }
  }, [searchParams, dispatch, router])

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
        setEmailError(response.error)
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
      
      // Store email using the custom hook
      updateData({ email })
      
      // Navigate to welcome page
      router.push('/signup/welcome')
    } catch (err: any) {
      setEmailError('Failed to verify email. Please try again.')
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
    clearLoginError()
    
    try {
      // Use the custom login hook
      await login(email, password)
    } catch (err: any) {
      console.error('Password submit error:', err)
      setPasswordError(err.message || 'Login failed')
    }
  }, [password, email, login, clearLoginError])

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

  return (
    <div className={`flex flex-col w-full max-w-[408px] items-center gap-12 lg:gap-[197px] ${className}`}>
      <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
        <p className="relative w-full max-w-[232px] mt-[-1.00px] font-heading-primary font-normal text-[color:var(--tokens-color-text-text-seconary)] text-3xl sm:text-4xl text-center tracking-[-1.80px] leading-9">
          <span className="font-light tracking-[-0.65px]">
            All your AI. <br />
          </span>

          <span className="tracking-[var(--h02-heading02-letter-spacing)] font-h02-heading02 [font-style:var(--h02-heading02-font-style)] font-[number:var(--h02-heading02-font-weight)] leading-[var(--h02-heading02-line-height)] text-[length:var(--h02-heading02-font-size)]">
            One gateway
          </span>

          <span className="tracking-[-0.65px]">.</span>
        </p>

        <div className="flex flex-col items-center gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] bg-[color:var(--tokens-color-surface-surface-primary)] rounded-3xl shadow-[-6px_4px_33.2px_#4d30711a]">
          <div className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
            <div className="flex items-center justify-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <button 
                type="button"
                className="inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] rounded-xl border border-solid border-[#dbdbdb] hover:border-[#bbb] hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={signInWithGitHub}
                disabled={isProcessingSSO}
                aria-label="Sign up with Github"
              >
                <img
                  className="relative w-6 h-6 aspect-[1]"
                  alt="Github"
                  src="/img/github.png"
                />

                <span className="relative w-fit font-body-primary font-normal text-black text-base tracking-[-0.48px] leading-[normal] whitespace-nowrap">
                  Github
                </span>
              </button>

              <button 
                type="button"
                className="inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] rounded-xl border border-solid border-[#dbdbdb] hover:border-[#bbb] hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={signInWithMicrosoft}
                disabled={isProcessingSSO}
                aria-label="Sign up with Microsoft"
              >
                <img
                  className="relative w-6 h-6 aspect-[1]"
                  alt="Microsoft"
                  src="/img/microsoft.png"
                />

                <span className="relative w-fit font-body-primary font-normal text-black text-base tracking-[-0.48px] leading-[normal] whitespace-nowrap">
                  Microsoft
                </span>
              </button>

              <button 
                type="button"
                className="inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] rounded-xl border border-solid border-[#dbdbdb] hover:border-[#bbb] hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={signInWithGoogle}
                disabled={isProcessingSSO}
                aria-label="Sign up with Google"
              >
                <img
                  className="relative w-6 h-6 aspect-[1] object-cover"
                  alt="Google"
                  src="/img/image-6.png"
                />

                <span className="relative w-fit font-body-primary font-normal text-black text-base tracking-[-0.48px] leading-[normal] whitespace-nowrap">
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

            <div className="relative w-fit mt-[-1.00px] font-body-primary font-normal text-[#dbdbdb] text-base tracking-[0] leading-[normal] whitespace-nowrap">
              OR
            </div>

            <img
              className="relative flex-1 grow h-px object-cover"
              alt="Line"
              src="/img/line-1.svg"
            />
          </div>

          <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
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
                
                {emailError && (
                  <p className="text-red-500 text-sm font-body-primary font-normal tracking-[-0.48px] leading-[normal] mt-2">
                    {emailError}
                  </p>
                )}
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
              
              {(passwordError || loginError) && (
                <p className="text-red-500 text-sm font-body-primary font-normal tracking-[-0.48px] leading-[normal] mt-2">
                  {passwordError || loginError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className={`transition-all duration-300 ease-in-out w-full ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
              <Buttons 
                property1="pressed" 
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
            <p className="relative w-fit mt-[-1.00px] font-body-primary font-normal text-transparent text-sm text-center tracking-[0] leading-[normal]">
              <span className="text-[#a0a0a0]">
                By continuing, you acknowledge our{" "}
              </span>

              <a 
                href="/privacy-policy" 
                className="text-[#2c1d3d] underline hover:text-[#1a0f2e] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
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
        className="border-[unset] rounded-[var(--premitives-corner-radius-corner-radius-3)] flex-[0_0_auto] border-[unset] bg-tokens-color-surface-surface-button-inactive hover:bg-opacity-80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center gap-2 px-3 py-1.5"
        onClick={() => {}}
        aria-label="Learn more about our features"
      >
        <span className="text-[color:var(--tokens-color-text-text-brand)] tracking-[-0.60px] text-xs font-normal font-heading-primary leading-4">
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
