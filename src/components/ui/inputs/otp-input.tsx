'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  className?: string
  error?: string
  disabled?: boolean
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = "",
  onChange,
  onComplete,
  className,
  error,
  disabled = false
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value) {
      const valueArray = value.split('').slice(0, length)
      const newOtp = [...otp]
      valueArray.forEach((char, index) => {
        newOtp[index] = char
      })
      setOtp(newOtp)
    }
  }, [value, length])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    const otpValue = newOtp.join('')
    onChange?.(otpValue)

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if OTP is complete
    if (otpValue.length === length && !otpValue.includes('')) {
      onComplete?.(otpValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const pastedArray = pastedData.split('')
    const newOtp = [...otp]
    
    pastedArray.forEach((char, index) => {
      if (index < length) {
        newOtp[index] = char
      }
    })
    
    setOtp(newOtp)
    const otpValue = newOtp.join('')
    onChange?.(otpValue)
    
    if (otpValue.length === length) {
      onComplete?.(otpValue)
    }
  }

  return (
    <div className="flex flex-col">
      <div className={cn("flex gap-2 justify-center", className)}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
              error 
                ? isDark
                  ? "border-red-500 bg-red-900/30 text-white"
                  : "border-red-500 bg-red-50 text-black"
                : isDark
                  ? "border-[color:var(--tokens-color-border-border-inactive)] bg-[color:var(--tokens-color-surface-surface-secondary)] text-white"
                  : "border-tokens-color-border-border-inactive bg-white text-black",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1 text-center">{error}</p>
      )}
    </div>
  )
}
