'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface PasswordInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
  error?: string
  disabled?: boolean
  showPasswordRequirements?: boolean
  onPasswordChange?: (password: string) => void
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = "Enter your password",
  value = "",
  onChange,
  onKeyDown,
  className,
  error,
  disabled = false,
  showPasswordRequirements = false,
  onPasswordChange
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange?.(newValue)
    onPasswordChange?.(newValue)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validatePassword = (pwd: string) => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      digit: /\d/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd)
    }
    return requirements
  }

  const passwordRequirements = showPasswordRequirements ? validatePassword(value) : null

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex w-[360px] h-[54px] items-center pl-4 pr-1 py-3 relative rounded-xl border border-solid",
          error 
            ? "border-red-500" 
            : "border-tokens-color-border-border-inactive",
          className
        )}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="relative flex-1 bg-transparent outline-none font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-seconary text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] placeholder:text-tokens-color-text-text-inactive-2 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="flex w-[46px] h-[46px] items-center justify-center gap-2.5 px-3 py-[18px] relative mt-[-8.00px] mb-[-8.00px] bg-transparent hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-tokens-color-text-text-inactive-2 text-sm">
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {showPasswordRequirements && passwordRequirements && (
        <div className="bg-tokens-color-surface-surface-secondary p-4 rounded-lg">
          <h3 className="text-sm font-medium text-tokens-color-text-text-secondary mb-2">
            Password Requirements:
          </h3>
          <ul className="text-xs text-tokens-color-text-text-inactive-2 space-y-1">
            <li className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-500' : ''}`}>
              <span>{passwordRequirements.length ? '✓' : '○'}</span>
              At least 8 characters
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-500' : ''}`}>
              <span>{passwordRequirements.uppercase ? '✓' : '○'}</span>
              One uppercase letter
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-500' : ''}`}>
              <span>{passwordRequirements.lowercase ? '✓' : '○'}</span>
              One lowercase letter
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.digit ? 'text-green-500' : ''}`}>
              <span>{passwordRequirements.digit ? '✓' : '○'}</span>
              One digit
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.special ? 'text-green-500' : ''}`}>
              <span>{passwordRequirements.special ? '✓' : '○'}</span>
              One special character
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
