import { useState } from 'react'
import { t } from '@/i18n'
import { PrimaryButton, BackButton } from '../../ui'
import { EmailInput } from '@/components/ui/inputs/email-input'
import { handleApiError } from '@/lib/error-handler'
import { useTheme } from '@/hooks/use-theme'
import { authApi } from '@/api/auth/api'
import { useToast } from '@/hooks/use-toast'

interface ForgotPasswordStepProps {
  onBack: () => void
  onNext?: (email: string) => void
  className?: string
}

export const ForgotPasswordStep = ({ 
  onBack,
  onNext,
  className 
}: ForgotPasswordStepProps) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  const validateEmail = (emailValue: string) => {
    if (!emailValue.trim()) {
      return t('auth.emailRequired')
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      return t('auth.validEmailRequired')
    }
    
    return ''
  }

  const handleSendResetCode = async () => {
    const validationError = validateEmail(email)
    
    if (validationError) {
      setEmailError(validationError)
      return
    }
    
    setEmailError('')
    setIsLoading(true)
    
    try {
      const response = await authApi.forgotPassword({ email })
      
      if (response.error) {
        // Use error_message directly from response if available (from processedError or error_message field)
        // This ensures we show the actual backend error message like "No account found with this email address."
        const errorMessage = response.error_message || response.processedError?.error_message || response.error
        setEmailError(errorMessage)
        showErrorToast('Failed to Send Reset Code', errorMessage)
      } else {
        showSuccessToast('Reset Code Sent', t('auth.resetCodeSentMessage'))
        // Navigate to reset password step with email
        if (onNext) {
          try {
            onNext(email)
          } catch (err) {
            // If navigation fails, don't show error toast as API call was successful
            console.error('Navigation error:', err)
          }
        }
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      setEmailError(errorMessage)
      showErrorToast('Failed to Send Reset Code', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) {
      setEmailError('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendResetCode()
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
              {t('auth.forgotPasswordTitle')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <p className="relative w-full font-text font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.forgotPasswordSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Email Input */}
          <EmailInput
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyDown}
            error={emailError}
            disabled={isLoading}
            placeholder={t('auth.enterEmailForReset')}
          />

          {/* Send Reset Code Button */}
          <PrimaryButton
            text={isLoading ? t('auth.sendingResetCode') : t('auth.sendResetCode')}
            onClick={handleSendResetCode}
            disabled={isLoading}
            loading={isLoading}
            className="!self-stretch !w-full"
          />
        </div>
      </div>
    </div>
  )
}

