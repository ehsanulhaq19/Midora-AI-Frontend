'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons/logo-only'
import { tokenManager } from '@/lib/token-manager'
import { authApi } from '@/api/auth/api'
import { useToast } from '@/hooks/useToast'
import { handleApiError } from '@/lib/error-handler'

interface SuccessStepProps {
  onNext?: () => void
  className?: string
  email?: string
  password?: string
  isSSOOnboarding?: boolean
}

export const SuccessStep = ({ onNext, className, email, password, isSSOOnboarding }: SuccessStepProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState(t('auth.settingUpAccount'))
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  useEffect(() => {
    const setupAccount = async () => {
      try {
        // For SSO onboarding, tokens are already set, just show completion
        if (isSSOOnboarding) {
          setLoadingMessage(t('auth.accountSetupComplete'))
          setTimeout(() => {
            if (onNext) {
              onNext()
            } else {
              router.push('/chat')
            }
          }, 1000)
          return
        }

        // Check if tokens are already set
        if (tokenManager.hasValidTokens()) {
          setLoadingMessage(t('auth.accountSetupComplete'))
          setTimeout(() => {
            router.push('/chat')
          }, 1000)
          return
        }

        // If no tokens and we have email/password, login
        if (email && password) {
          setLoadingMessage(t('auth.settingUpAccount'))
          
          const response = await authApi.login({
            email,
            password
          })

          if (response.success && response.data) {
            // Store tokens
            tokenManager.storeTokens(
              response.data.access_token,
              response.data.refresh_token,
              'email'
            )

            setLoadingMessage(t('auth.accountSetupComplete'))
            showSuccessToast('Login Successful', 'Welcome to Midora!')
            
            setTimeout(() => {
              router.push('/chat')
            }, 1000)
          } else {
            throw new Error(response.error || 'Login failed')
          }
        } else {
          throw new Error('Missing email or password for login')
        }
      } catch (err: any) {
        console.error('Account setup error:', err)
        showErrorToast('Setup Failed', handleApiError(err))
        setIsLoading(false)
      }
    }

    setupAccount()
  }, [email, password, onNext, router, showSuccessToast, showErrorToast, isSSOOnboarding])

  return (
    <main className={`w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="w-full max-w-[408px]">
        <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <LogoOnly
              className="!h-14 !aspect-[1.02] !w-[57px] mx-auto"
            />
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            
            <h1 className="relative w-full max-w-[400px] mt-[-1.00px] font-heading-primary font-normal text-[color:var(--tokens-color-text-text-seconary)] text-3xl sm:text-4xl tracking-[-1.80px] leading-9">
              <span className="font-light tracking-[-0.65px]">
                {t('auth.successTitle')}
              </span>
            </h1>
            
            <p className="relative w-full max-w-[350px] font-body-primary font-normal text-[#a0a0a0] text-base tracking-[-0.48px] leading-6">
              {t('auth.successSubtitle')}
            </p>
          </div>

          {/* Loading Section */}
          <div className="flex flex-col items-center gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] bg-[color:var(--tokens-color-surface-surface-primary)] rounded-3xl shadow-[-6px_4px_33.2px_#4d30711a]">
            <div className="flex flex-col items-center gap-4">
              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              <p className="text-center text-tokens-color-text-text-inactive-2 text-sm">
                {loadingMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
