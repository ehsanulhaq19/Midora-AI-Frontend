import { useState } from 'react'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons'
import { PasswordInput, PrimaryButton, BackButton } from '../../ui'
import { handleApiError } from '@/lib/error-handler'
import { useTheme } from '@/hooks/use-theme'
interface PasswordStepProps {
  onNext: (password: string) => void
  onBack: () => void
  className?: string
}

export const PasswordStep = ({ 
  onNext, 
  onBack, 
  className 
}: PasswordStepProps) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{password?: string, confirmPassword?: string}>({})
  const [isLoading, setIsLoading] = useState(false)

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
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const handleSignUp = async () => {
    const passwordErrors = validatePassword(password)
    const newErrors: {password?: string, confirmPassword?: string} = {}
    
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0] // Show first error
    }
    
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
      await onNext(password)
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      setErrors({ password: errorMessage })
    } finally {
      setIsLoading(false)
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
      handleSignUp()
    }
  }

  return (
    <div className={`relative w-full bg-tokens-color-surface-surface-primary flex flex-col justify-center ${className}`}>
      <div className="inline-flex flex-col items-start gap-9 max-w-[475px] w-full px-1">   
      <div className="flex relative items-center gap-3 justify-start md:justify-center">
      <div className='absolute left-[-250px] top-0'> <BackButton /></div>
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
              {t('auth.passwordTitle')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <p className="relative w-full font-text font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.passwordSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
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
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            error={errors.password}
            className="!self-stretch !w-full"
            showPasswordRequirements={false}
          />

          {/* Confirm Password Input */}
          <PasswordInput
            placeholder={t('auth.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onKeyDown={handleKeyDown}
            error={errors.confirmPassword}
            className="!self-stretch !w-full"
            showPasswordRequirements={false}
          />

          {/* Sign Up Button */}
          <PrimaryButton
            text={isLoading ? t('auth.signingUp') : t('auth.signUpUser')}
            onClick={handleSignUp}
            disabled={isLoading}
            loading={isLoading}
            className="!self-stretch !w-full"
          />
        </div>
      </div>
    </div>
  )
}
