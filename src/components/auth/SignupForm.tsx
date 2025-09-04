'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { SignupFormData } from '@/api/auth/types'
import { t } from '@/i18n'

export interface SignupFormProps {
  className?: string
  onGoogleSignup?: () => void
  onLoginClick?: () => void
}

export function SignupForm({
  className,
  onGoogleSignup,
  onLoginClick
}: SignupFormProps) {
  const { register, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{
    first_name?: string
    last_name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = t('auth.nameRequired')
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = t('auth.nameRequired')
    }

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.validEmailRequired')
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      clearError()
      const { confirmPassword, ...userData } = formData
      await register(userData)
    }
  }

  const handleInputChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    // Clear auth error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleGoogleSignup = () => {
    onGoogleSignup?.()
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
          {t('auth.createAccount')}
        </h1>
        <p className="text-lg text-gray-700">
          {t('auth.startJourney')}
        </p>
      </div>

      {/* Signup Form Card */}
      <Card className="shadow-lg border-0 bg-white rounded-xl">
        <CardContent className="p-8 space-y-6">
          {/* Google Signup Button */}
          <Button
            variant="outline"
            onClick={handleGoogleSignup}
            className="w-full h-12 text-base font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
{t('auth.signUpWithGoogle')}
          </Button>

          {/* Separator */}
          <div className="relative">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder={t('auth.enterFirstName')}
                value={formData.first_name}
                onChange={handleInputChange('first_name')}
                error={errors.first_name}
                className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <Input
                type="text"
                placeholder={t('auth.enterLastName')}
                value={formData.last_name}
                onChange={handleInputChange('last_name')}
                error={errors.last_name}
                className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <Input
              type="email"
              placeholder={t('auth.enterEmail')}
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            
            <Input
              type="password"
              placeholder={t('auth.createPassword')}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              className="h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />

            <Input
              type="password"
              placeholder={t('auth.confirmYourPassword')}
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
              {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
            >
              {t('auth.login')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
