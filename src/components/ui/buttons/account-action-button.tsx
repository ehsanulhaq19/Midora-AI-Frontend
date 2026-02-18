'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'

interface AccountActionButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

/**
 * Account Action Button - For account section actions
 * Handles dark theme internally
 */
export const AccountActionButton: React.FC<AccountActionButtonProps> = ({
  onClick,
  children,
  variant = 'secondary',
  className = '',
  disabled = false
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const getStyles = () => {
    if (variant === 'primary') {
      return isDark
        ? {
            backgroundColor: 'var(--tokens-color-surface-surface-card-hover)',
            color: 'var(--tokens-color-text-text-primary)',
            border: '1px solid var(--tokens-color-border-border-subtle)'
          }
        : {
            backgroundColor: 'var(--tokens-color-surface-surface-button-pressed)',
            color: 'white'
          }
    }
    
    // secondary variant
    return isDark
      ? {
          backgroundColor: 'var(--tokens-color-surface-surface-card-hover)',
          color: 'var(--tokens-color-text-text-primary)',
          border: '1px solid var(--tokens-color-border-border-subtle)'
        }
      : {
          backgroundColor: 'rgba(107,67,146,0.1)',
          color: 'var(--tokens-color-text-text-brand)'
        }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={getStyles()}
      className={`
        py-[14px] h-12 px-6 flex items-center justify-center rounded-lg 
        hover:opacity-90 transition-opacity 
        font-h02-heading02 font-[number:var(--text-font-weight)] 
        text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] 
        leading-[var(--text-line-height)] [font-style:var(--text-font-style)] 
        w-full md:w-auto
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}

