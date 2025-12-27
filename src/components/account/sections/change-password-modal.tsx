'use client'

import React, { useState, useEffect } from 'react'
import { Close } from '@/icons'
import { t } from '@/i18n'
import { useTheme } from '@/hooks/use-theme'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { OTPInput, PasswordInput, PrimaryButton } from '@/components/ui'
import { handleApiError } from '@/lib/error-handler'
import { authApi } from '@/api/auth/api'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const { resetPassword, regenerateOTP } = useAuth()
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  const [step, setStep] = useState<'confirm' | 'reset'>('confirm')
  const [isLoading, setIsLoading] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    otpCode?: string
    password?: string
    confirmPassword?: string
  }>({})

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Reset state when modal opens
      setStep('confirm')
      setOtpCode('')
      setPassword('')
      setConfirmPassword('')
      setErrors({})
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = []
    
    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(pwd)) {
      errors.push('Password must contain at least one digit')
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd)) {
      errors.push('Password must contain at least one special character')
    }
    
    return errors
  }

  const handleSendOTP = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      const response = await authApi.forgotPassword({ email: userEmail })
      if (response.error) {
        const errorMessage = response.error_message || response.processedError?.error_message || response.error
        showErrorToast('Failed to Send Reset Code', errorMessage)
      } else {
        showSuccessToast('Reset Code Sent', t('auth.resetCodeSentMessage') || 'A reset code has been sent to your email')
        setStep('reset')
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      showErrorToast('Failed to Send Reset Code', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerateOTP = async () => {
    setIsLoading(true)
    setErrors({})

    try {
      await regenerateOTP(userEmail)
      showSuccessToast('Reset Code Sent', t('auth.resetCodeSentMessage') || 'A new reset code has been sent to your email')
      setOtpCode('')
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      showErrorToast('Failed to Send Reset Code', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    const newErrors: {
      otpCode?: string
      password?: string
      confirmPassword?: string
    } = {}

    // Validate OTP
    if (!otpCode.trim()) {
      newErrors.otpCode = t('auth.otpRequired') || 'OTP code is required'
    } else if (otpCode.length !== 6) {
      newErrors.otpCode = t('auth.otpMinLength') || 'OTP code must be 6 digits'
    } else if (!/^\d{6}$/.test(otpCode)) {
      newErrors.otpCode = 'Please enter a valid 6-digit code'
    }

    // Validate password
    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0]
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch') || 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await resetPassword({
        email: userEmail,
        otp_code: otpCode,
        new_password: password
      })
      
      showSuccessToast('Password Changed', t('auth.passwordResetSuccessMessage') || 'Your password has been changed successfully')
      onClose()
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      setErrors({ otpCode: errorMessage })
      showErrorToast('Password Reset Failed', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (value: string) => {
    setOtpCode(value)
    if (errors.otpCode) {
      setErrors(prev => ({ ...prev, otpCode: undefined }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }))
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose()
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        className="relative bg-[color:var(--tokens-color-surface-surface-primary)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--tokens-color-border-border-inactive)] bg-[color:var(--tokens-color-surface-surface-secondary)]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[color:var(--tokens-color-text-text-primary)]">
              {step === 'confirm' 
                ? (t('account.profile.changePassword') || 'Change Password')
                : (t('auth.resetPasswordTitle') || 'Reset Password')
              }
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Close"
          >
            <Close
              className="w-5 h-5 transition-transform group-hover:rotate-90"
              color="var(--tokens-color-text-text-primary)"
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1">
          {step === 'confirm' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[color:var(--tokens-color-surface-surface-secondary)] border border-[color:var(--tokens-color-border-border-inactive)]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-[color:var(--tokens-color-text-text-primary)]">
                    {t('account.profile.changePasswordDescription') || 'We will send a verification code to your email address to confirm the password change.'}
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                    {t('account.profile.changePasswordEmail') || 'Email'}
                  </span>
                </div>
                <p className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] break-all">
                  {userEmail}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Email Display (Read-only) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[color:var(--tokens-color-text-text-primary)] mb-1">
                  Email Address
                </label>
                <div className={`flex h-[56px] items-center gap-3 relative self-stretch w-full rounded-xl border-2 border-solid px-4 py-3 transition-all ${
                  isDark 
                    ? 'border-[color:var(--tokens-color-border-border-inactive)] bg-[color:var(--tokens-color-surface-surface-secondary)]' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className={`relative w-full font-SF-Pro font-medium text-sm tracking-[-0.48px] leading-[100%] truncate ${
                    isDark 
                      ? 'text-gray-200' 
                      : 'text-gray-700'
                  }`}>
                    {userEmail}
                  </span>
                </div>
              </div>

              {/* OTP Input */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[color:var(--tokens-color-text-text-primary)]">
                    {t('auth.enterResetCode') || 'Enter Reset Code'}
                  </label>
                </div>
                <div className="flex justify-center">
                  <OTPInput
                    value={otpCode}
                    onChange={handleOtpChange}
                    error={errors.otpCode}
                    disabled={isLoading}
                    length={6}
                    className="gap-3"
                  />
                </div>
                {errors.otpCode && (
                  <p className="text-sm text-red-500 text-center mt-1">{errors.otpCode}</p>
                )}
              </div>

              {/* Regenerate OTP Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleRegenerateOTP}
                  disabled={isLoading}
                  className="group flex items-center gap-2 text-sm font-medium text-[color:var(--tokens-color-text-text-seconary)] hover:text-[color:var(--tokens-color-text-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{t('auth.regenerateOTP') || 'Resend Code'}</span>
                </button>
              </div>

              {/* Password Requirements */}
              <div className="bg-gradient-to-br from-[color:var(--tokens-color-surface-surface-secondary)] to-[color:var(--tokens-color-surface-surface-tertiary)] p-5 rounded-xl border border-[color:var(--tokens-color-border-border-inactive)]">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-[color:var(--tokens-color-text-text-primary)]">
                    {t('auth.passwordRequirements') || 'Password Requirements'}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  <li className={`flex items-center gap-3 transition-colors duration-200 ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      password.length >= 8 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {password.length >= 8 ? (
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className="text-sm">{t('auth.passwordRequirementLength') || 'At least 8 characters'}</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-colors duration-200 ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      /[A-Z]/.test(password) 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {/[A-Z]/.test(password) ? (
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className="text-sm">{t('auth.passwordRequirementUppercase') || 'One uppercase letter'}</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-colors duration-200 ${/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      /[a-z]/.test(password) 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {/[a-z]/.test(password) ? (
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className="text-sm">{t('auth.passwordRequirementLowercase') || 'One lowercase letter'}</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-colors duration-200 ${/\d/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      /\d/.test(password) 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {/\d/.test(password) ? (
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className="text-sm">{t('auth.passwordRequirementDigit') || 'One digit'}</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-colors duration-200 ${/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? (
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className="text-sm">{t('auth.passwordRequirementSpecial') || 'One special character'}</span>
                  </li>
                </ul>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[color:var(--tokens-color-text-text-primary)] mb-1">
                  {t('auth.enterNewPassword') || 'New Password'}
                </label>
                <PasswordInput
                  placeholder={t('auth.enterNewPassword') || 'Enter new password'}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  disabled={isLoading}
                  className="!w-full"
                  showPasswordRequirements={false}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[color:var(--tokens-color-text-text-primary)] mb-1">
                  {t('auth.confirmNewPassword') || 'Confirm New Password'}
                </label>
                <PasswordInput
                  placeholder={t('auth.confirmNewPassword') || 'Confirm new password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={errors.confirmPassword}
                  disabled={isLoading}
                  className="!w-full"
                  showPasswordRequirements={false}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-stretch gap-3 px-6 py-5 border-t border-[color:var(--tokens-color-border-border-inactive)] bg-[color:var(--tokens-color-surface-surface-secondary)]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            {t('account.cancel') || 'Cancel'}
          </button>
          {step === 'confirm' ? (
            <PrimaryButton
              text={isLoading ? (t('auth.sendingResetCode') || 'Sending...') : (t('auth.sendResetCode') || 'Send Reset Code')}
              onClick={handleSendOTP}
              disabled={isLoading}
              loading={isLoading}
              className="flex-1 !h-11 !px-6 !py-2.5 !rounded-xl !font-medium !transition-all !duration-200 hover:!scale-[1.02] active:!scale-[0.98]"
            />
          ) : (
            <PrimaryButton
              text={isLoading ? (t('auth.resettingPassword') || 'Resetting...') : (t('auth.resetPassword') || 'Reset Password')}
              onClick={handleResetPassword}
              disabled={isLoading}
              loading={isLoading}
              className="flex-1 !h-11 !px-6 !py-2.5 !rounded-xl !font-medium !transition-all !duration-200 hover:!scale-[1.02] active:!scale-[0.98]"
            />
          )}
        </div>
      </div>
    </div>
  )
}

