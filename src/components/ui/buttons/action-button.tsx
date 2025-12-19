'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'

interface ActionButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Action Button Component
 * Handles all theme logic internally - just use it and forget about isDark!
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  loading = false,
  children,
  className = '',
  type = 'button',
  leftIcon,
  rightIcon
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Size classes
  const sizeClasses = {
    sm: 'h-9 px-4 py-2 text-sm',
    md: 'h-[54px] px-6 py-3 text-base',
    lg: 'h-14 px-8 py-4 text-lg'
  }

  // Variant classes with theme support
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return isDark
          ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)] text-[color:var(--tokens-color-surface-surface-dark)]'
          : 'bg-tokens-color-surface-surface-button-pressed text-white'
      
      case 'secondary':
        return isDark
          ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)] text-white'
          : 'bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-primary)]'
      
      case 'outline':
        return isDark
          ? 'border border-white/20 bg-transparent text-white hover:border-white/30 hover:bg-white/5'
          : 'border border-[#dbdbdb] bg-transparent text-[color:var(--tokens-color-text-text-primary)] hover:border-[#bbb] hover:bg-gray-50'
      
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700'
      
      case 'ghost':
        return isDark
          ? 'bg-transparent text-white hover:bg-white/10'
          : 'bg-transparent text-[color:var(--tokens-color-text-text-primary)] hover:bg-gray-100'
      
      default:
        return ''
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2.5 relative rounded-xl 
        font-SF-Pro font-normal tracking-[-0.48px] leading-[100%]
        transition-all duration-200 focus:outline-none 
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:opacity-90
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
            isDark && variant === 'primary' 
              ? 'border-[color:var(--tokens-color-surface-surface-dark)]' 
              : 'border-current'
          }`} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

