'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'

interface PrimaryButtonProps {
  property1?: 'pressed' | 'active'
  className?: string
  text?: string
  onClick?: () => void
  disabled?: boolean
  divClassName?: string
  loading?: boolean
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  property1, 
  className, 
  text, 
  onClick, 
  disabled, 
  divClassName,
  loading = false
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button 
      type="button"
      disabled={disabled || loading}
      className={`flex w-full h-[54px] items-center justify-center gap-2.5 px-[74px] py-[18px] relative rounded-xl hover:bg-opacity-90 transition-colors duration-200  focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)]' : 'bg-tokens-color-surface-surface-button-pressed'} ${className}`}
      onClick={onClick || (() => {})}
      aria-label={text || "Continue with email"}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="relative w-fit font-SF-Pro font-normal text-[#FFFEFE] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap">
            Loading...
          </span>
        </div>
      ) : (
        <span className={`relative w-fit font-SF-Pro font-normal text-[#FFFEFE] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap ${divClassName}`}>
          {text || "Continue with email"}
        </span>
      )}
    </button>
  )
}
