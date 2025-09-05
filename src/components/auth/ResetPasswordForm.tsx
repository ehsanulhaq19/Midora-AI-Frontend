'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { t } from '@/i18n'

export interface ResetPasswordFormProps {
  className?: string
  email: string
  onBackToLogin?: () => void
  onSuccess?: () => void
}

export function ResetPasswordForm({
  className,
  email,
  onBackToLogin,
  onSuccess
}: ResetPasswordFormProps) {
  const { resetPassword, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    otpCode: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{
    otpCode?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: {
      otpCode?: string
      newPassword?: string
      confirmPassword?: string
    } = {}

    if (!formData.otpCode) {
      newErrors.otpCode = t('auth.otpRequired')
    } else if (formData.otpCode.length !== 6) {
      newErrors.otpCode = t('auth.otpMinLength')
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t('auth.passwordRequired')
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('auth.passwordMinLength')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired')
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      clearError()
      try {
        await resetPassword({
          email,
          otp_code: formData.otpCode,
          new_password: formData.newPassword
        })
        setIsSuccess(true)
        onSuccess?.()
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
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
            {t('auth.passwordResetSuccess')}
          </h1>
          <p className="text-lg text-gray-700">
            {t('auth.passwordResetSuccessMessage')}
          </p>
        </div>

        {/* Success Card */}
        <Card className="shadow-lg border-0 bg-white rounded-xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                {t('auth.passwordResetSuccessMessage')}
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
          {t('auth.resetPasswordTitle')}
        </h1>
        <p className="text-lg text-gray-700">
          {t('auth.resetPasswordSubtitle')}
        </p>
      </div>

      {/* Reset Password Form Card */}
      <Card className="shadow-lg border-0 bg-white rounded-xl">
        <CardContent className="p-8 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder={t('auth.enterResetCode')}
              value={formData.otpCode}
              onChange={handleInputChange('otpCode')}
              error={errors.otpCode}
              className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              maxLength={6}
            />
            
            <Input
              type="password"
              placeholder={t('auth.enterNewPassword')}
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              error={errors.newPassword}
              className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />

            <Input
              type="password"
              placeholder={t('auth.confirmNewPassword')}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-purple-800 text-white hover:bg-purple-900 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? t('auth.resettingPassword') : t('auth.resetPassword')}
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
