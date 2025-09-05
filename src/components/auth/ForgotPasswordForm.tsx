'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { t } from '@/i18n'

export interface ForgotPasswordFormProps {
  className?: string
  onBackToLogin?: () => void
  onSuccess?: (email: string) => void
}

export function ForgotPasswordForm({
  className,
  onBackToLogin,
  onSuccess
}: ForgotPasswordFormProps) {
  const { forgotPassword, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email: string) => {
    if (!email) {
      return t('auth.emailRequired')
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return t('auth.validEmailRequired')
    }
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }

    clearError()
    try {
      await forgotPassword(email)
      setIsSuccess(true)
      onSuccess?.(email)
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear error when user starts typing
    if (emailError) {
      setEmailError(undefined)
    }
    // Clear auth error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleBackToLogin = () => {
    onBackToLogin?.()
  }

  if (isSuccess) {
    return (
      <div className={cn('w-full max-w-md', className)}>
        {/* Logo and Headline */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            {t('auth.resetCodeSent')}
          </h1>
          <p className="text-lg text-gray-700">
            {t('auth.resetCodeSentMessage')}
          </p>
        </div>

        {/* Success Card */}
        <Card className="shadow-lg border-0 bg-white rounded-xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                {t('auth.resetCodeSentMessage')}
              </p>
              <Button
                onClick={handleBackToLogin}
                className="w-full h-12 text-base font-medium bg-purple-800 text-white hover:bg-purple-900 rounded-lg transition-colors"
              >
                {t('auth.backToLogin')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn('w-full max-w-md', className)}>
      {/* Logo and Headline */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
          {t('auth.forgotPasswordTitle')}
        </h1>
        <p className="text-lg text-gray-700">
          {t('auth.forgotPasswordSubtitle')}
        </p>
      </div>

      {/* Forgot Password Form Card */}
      <Card className="shadow-lg border-0 bg-white rounded-xl">
        <CardContent className="p-8 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder={t('auth.enterEmailForReset')}
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-purple-800 text-white hover:bg-purple-900 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? t('auth.sendingResetCode') : t('auth.sendResetCode')}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center text-sm text-gray-600">
            {t('auth.rememberPassword')}{' '}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
            >
              {t('auth.backToLogin')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
