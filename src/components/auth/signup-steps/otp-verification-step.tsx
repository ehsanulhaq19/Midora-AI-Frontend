import { useState, useEffect } from 'react'
import { t, tArray } from '@/i18n'
import { LogoOnly } from '@/icons'
import { OTPInput, PrimaryButton } from '../../ui'
import { handleApiError } from '@/lib/error-handler'

interface OTPVerificationStepProps {
  onNext: (otpCode: string) => Promise<void>
  onBack: () => void
  onRegenerateOTP: () => Promise<void>
  email: string
  isLoading?: boolean
  className?: string
}

export const OTPVerificationStep = ({ 
  onNext, 
  onBack, 
  onRegenerateOTP,
  email,
  isLoading = false,
  className 
}: OTPVerificationStepProps) => {
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [regenerateCooldown, setRegenerateCooldown] = useState(0)

  useEffect(() => {
    setRegenerateCooldown(60)
    const timer = setInterval(() => {
      setRegenerateCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleOTPSubmit = async (code: string) => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }
    
    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code')
      return
    }
    
    if (isVerifying || isLoading) return
    
    setIsVerifying(true)
    setError('')
    
    try {
      await onNext(code)
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRegenerateOTP = async () => {
    if (regenerateCooldown > 0 || isRegenerating) return
    
    setIsRegenerating(true)
    setError('')
    
    try {
      await onRegenerateOTP()
      setRegenerateCooldown(60)
      
      // Start new cooldown timer
      const timer = setInterval(() => {
        setRegenerateCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleOTPChange = (value: string) => {
    setOtpCode(value)
    
    if (error) {
      setError('')
    }
  }

  const handleOTPComplete = (value: string) => {
    handleOTPSubmit(value)
  }

  return (
    <div className={`relative w-full bg-tokens-color-surface-surface-primary flex flex-col justify-center ${className}`}>
      <div className="inline-flex flex-col items-start gap-9 max-w-[475px] w-full px-4">   
        <LogoOnly
            className="!h-14 !aspect-[1.02] !w-[57px] mx-auto ml-0"
        />     
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <h1 className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-[24px] tracking-[-1.80px] leading-[36px]">
              {t('auth.verifyEmailTitle')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <p className="relative w-full font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.verifyEmailSubtitle')} <strong>{email}</strong>. Please enter it below.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Check your email instructions - moved above OTP field */}
          <div className="bg-tokens-color-surface-surface-secondary p-4 rounded-lg pt-0 pl-0">
            <h3 className="text-sm font-medium text-tokens-color-text-text-secondary mb-2">
              {t('auth.checkYourEmail')}
            </h3>
            <ul className="text-xs text-tokens-color-text-text-inactive-2 space-y-1">
              {tArray('auth.checkEmailInstructions').map((instruction, index) => (
                <li key={index}>• {instruction}</li>
              ))}
            </ul>
          </div>

          {/* OTP Input */}
          <OTPInput
            value={otpCode}
            onChange={handleOTPChange}
            onComplete={handleOTPComplete}
            error={error}
            disabled={isVerifying || isLoading}
            className="!self-stretch !w-full"
          />

          {/* Verify Button */}
          <PrimaryButton
            text={(isVerifying || isLoading) ? t('auth.verifyingOtpCode') : t('auth.verifyOtpCode')}
            onClick={() => handleOTPSubmit(otpCode)}
            disabled={isVerifying || isLoading || otpCode.length !== 6}
            loading={isVerifying || isLoading}
            className="!self-stretch !w-full"
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm text-tokens-color-text-text-inactive-2 text-center">
              {t('auth.didntReceiveCode')}
            </p>
            <button
              type="button"
              onClick={handleRegenerateOTP}
              disabled={regenerateCooldown > 0 || isRegenerating}
              className={`text-sm font-medium transition-colors ${
                regenerateCooldown > 0 || isRegenerating
                  ? 'text-tokens-color-text-text-inactive-2 cursor-not-allowed'
                  : 'text-tokens-color-text-text-secondary hover:text-tokens-color-text-text-primary cursor-pointer'
              }`}
            >
              {isRegenerating 
                ? t('auth.resendingCode')
                : regenerateCooldown > 0 
                  ? `${t('auth.resendIn')} ${regenerateCooldown}${t('auth.seconds')}` 
                  : t('auth.resendCode')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
