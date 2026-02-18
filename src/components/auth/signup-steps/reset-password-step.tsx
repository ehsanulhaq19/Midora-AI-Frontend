import { useState } from 'react'
import { t } from '@/i18n'
import { PrimaryButton, BackButton, PasswordInput, OTPInput } from '../../ui'
import { handleApiError } from '@/lib/error-handler'
import { useTheme } from '@/hooks/use-theme'
import { authApi } from '@/api/auth/api'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface ResetPasswordStepProps {
  email: string
  onBack: () => void
  className?: string
}

export const ResetPasswordStep = ({ 
  email,
  onBack, 
  className 
}: ResetPasswordStepProps) => {
  const [otpCode, setOtpCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    otpCode?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const router = useRouter()

  const validatePassword = (pwd: string) => {
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

  const handleResetPassword = async () => {
    const newErrors: {
      otpCode?: string
      password?: string
      confirmPassword?: string
    } = {}

    // Validate OTP
    if (!otpCode.trim()) {
      newErrors.otpCode = t('auth.otpRequired')
    } else if (otpCode.length !== 6) {
      newErrors.otpCode = t('auth.otpMinLength')
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
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const response = await authApi.resetPassword({
        email,
        otp_code: otpCode,
        new_password: password
      })

      if (response.error) {
        const errorMessage = handleApiError(response)
        setErrors({ otpCode: errorMessage })
        showErrorToast('Password Reset Failed', errorMessage)
      } else {
        showSuccessToast('Password Reset Successful', t('auth.passwordResetSuccessMessage'))
        // Navigate to /chat after successful reset
        router.push('/chat')
      }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleResetPassword()
    }
  }

  return (
    <div className={`relative w-full bg-tokens-color-surface-surface-primary flex flex-col justify-center ${className}`}>
      <div className="inline-flex flex-col items-start gap-9 max-w-[475px] w-full px-1">   
        <div className="flex relative items-center gap-3 justify-start md:justify-center">
          <div className='absolute left-[-250px] top-0'>
            <BackButton onClick={onBack} />
          </div>
          <a 
            href="/" 
            className="flex flex-col w-[120px] sm:w-[140px] lg:w-[154px] items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          >
            {isDark ? (
              <img
                className="relative self-stretch w-full "
                alt="Midora AI Logo"
                src="/img/dark-logo-text.png"
              />
            ) : (
              <img
                className="relative self-stretch w-full aspect-[5.19] object-cover"
                alt="Midora AI Logo"
                src="/img/logo.png"
              />
            )}
          </a>
        </div>    
        
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <h1 className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-[24px] tracking-[-1.80px] leading-[36px]">
              {t('auth.resetPasswordTitle')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <p className="relative w-full font-text font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.resetPasswordSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Email Display (Read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[color:var(--tokens-color-text-text-secondary)]">
              Email
            </label>
            <div className={`flex h-[54px] items-center gap-3 relative self-stretch w-full rounded-xl border border-solid px-6 py-3 ${
              isDark 
                ? 'border-[color:var(--tokens-color-border-border-inactive)] bg-[color:var(--tokens-color-surface-surface-secondary)]' 
                : 'border-[#dbdbdb] bg-gray-50'
            }`}>
              <span className={`relative w-full font-SF-Pro font-normal app-text tracking-[-0.48px] leading-[100%] ${
                isDark 
                  ? 'text-white' 
                  : 'text-[color:var(--tokens-color-text-text-inactive-2)]'
              }`}>
                {email}
              </span>
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[color:var(--tokens-color-text-text-secondary)]">
              {t('auth.enterResetCode')}
            </label>
            <OTPInput
              value={otpCode}
              onChange={handleOtpChange}
              error={errors.otpCode}
              disabled={isLoading}
              length={6}
            />
          </div>

          {/* Password Requirements - moved above fields */}
          <div className="bg-tokens-color-surface-surface-secondary p-4 rounded-lg pt-0 pl-0">
            <h3 className="text-sm font-medium text-tokens-color-text-text-secondary mb-2">
              {t('auth.passwordRequirements')}
            </h3>
            <ul className="text-xs [color:var(--tokens-color-text-text-inactive-2)] space-y-1">
              <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-500' : ''}`}>
                <span>{password.length >= 8 ? '✓' : '○'}</span>
                {t('auth.passwordRequirementLength')}
              </li>
              <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-500' : ''}`}>
                <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                {t('auth.passwordRequirementUppercase')}
              </li>
              <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-500' : ''}`}>
                <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                {t('auth.passwordRequirementLowercase')}
              </li>
              <li className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-500' : ''}`}>
                <span>{/\d/.test(password) ? '✓' : '○'}</span>
                {t('auth.passwordRequirementDigit')}
              </li>
              <li className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 'text-green-500' : ''}`}>
                <span>{/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? '✓' : '○'}</span>
                {t('auth.passwordRequirementSpecial')}
              </li>
            </ul>
          </div>

          {/* Password Input */}
          <PasswordInput
            placeholder={t('auth.enterNewPassword')}
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            error={errors.password}
            className="!self-stretch !w-full"
            showPasswordRequirements={false}
          />

          {/* Confirm Password Input */}
          <PasswordInput
            placeholder={t('auth.confirmNewPassword')}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onKeyDown={handleKeyDown}
            error={errors.confirmPassword}
            className="!self-stretch !w-full"
            showPasswordRequirements={false}
          />

          {/* Reset Password Button */}
          <PrimaryButton
            text={isLoading ? t('auth.resettingPassword') : t('auth.resetPassword')}
            onClick={handleResetPassword}
            disabled={isLoading}
            loading={isLoading}
            className="!self-stretch !w-full"
          />
        </div>
      </div>
    </div>
  )
}

