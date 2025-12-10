'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'

interface EmailInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  onKeyDown,
  error,
  disabled = false,
  placeholder = "Enter your personal or work email",
  className = ""
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className={`flex h-[54px] items-center gap-3 relative self-stretch w-full rounded-xl border border-solid transition-all duration-200 focus-within:ring-offset-2 ${
      error 
        ? 'border-red-500 focus-within:ring-red-500' 
        : 'border-[#dbdbdb] focus-within:ring-blue-500'
    } ${className}`}>
      <input
        type="email"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`relative w-full font-SF-Pro font-normal app-text tracking-[-0.48px] leading-[100%] bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'text-white' : 'text-black'}`}
        aria-label="Email address"
        required
      />
    </div>
  )
}
