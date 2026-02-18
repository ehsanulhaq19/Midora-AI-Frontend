'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons/logo-only'
import { tokenManager } from '@/lib/token-manager'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { handleApiError } from '@/lib/error-handler'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/authSlice'

interface SuccessStepProps {
  onNext?: () => void
  className?: string
  email?: string
  password?: string
  isSSOOnboarding?: boolean
}

export const SuccessStep = ({ onNext, className, email, password, isSSOOnboarding }: SuccessStepProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState(t('auth.settingUpAccount'))
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const { login, getCurrentUser, completeOnboarding } = useAuth()

  useEffect(() => {
    const setupAccount = async () => {
      try {
        // For SSO onboarding, tokens are already set, just show completion
        if (isSSOOnboarding) {
          // Get current user data and store in Redux
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
          
            // Complete onboarding
            await completeOnboarding()
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
          // Get current user data and store in Redux
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
          
          // Complete onboarding
          await completeOnboarding()
          setLoadingMessage(t('auth.accountSetupComplete'))
          setTimeout(() => {
            router.push('/chat')
          }, 1000)
          return
        }

        // If no tokens and we have email/password, login
        if (email && password) {
          setLoadingMessage(t('auth.settingUpAccount'))
          
          await login({
            email,
            password
          })

          // Get user data and store in Redux
          const userData = await getCurrentUser()
          if (userData) {
            const tokens = tokenManager.getTokens()
            dispatch(loginSuccess({
              user: userData,
              accessToken: tokens.accessToken!,
              refreshToken: tokens.refreshToken!,
              authMethod: 'email'
            }))
          }

          // Complete onboarding
          await completeOnboarding()
          setLoadingMessage(t('auth.accountSetupComplete'))
          setTimeout(() => {
            router.push('/chat')
          }, 1000)
        } else {
          const errorObject = {
            error_type: 'MISSING_CREDENTIALS',
            error_message: 'Missing email or password for login',
            error_id: undefined,
            status: 400
          }
          throw new Error(JSON.stringify(errorObject))
        }
      } catch (err: any) {
        console.error('Account setup error:', err)
        showErrorToast('Setup Failed', handleApiError(err))
        setIsLoading(false)
      }
    }

    setupAccount()
  }, [email, password, onNext, router, showSuccessToast, showErrorToast, isSSOOnboarding, dispatch, login, getCurrentUser, completeOnboarding])

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
            <h1 className="relative w-full max-w-[400px] mt-[-1.00px] font-h02-heading02 font-normal text-[color:var(--tokens-color-text-text-seconary)] text-3xl sm:text-4xl tracking-[-1.80px] leading-9">
              <span className="font-light tracking-[-0.65px]">
                {t('auth.successTitle')}
              </span>
            </h1>
            
            <p className="relative w-full max-w-[350px] font-body-primary font-normal [color:var(--tokens-color-text-text-inactive-2)]text-base tracking-[-0.48px] leading-6">
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
              <p className="text-center [color:var(--tokens-color-text-text-inactive-2)] text-sm">
                {loadingMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
