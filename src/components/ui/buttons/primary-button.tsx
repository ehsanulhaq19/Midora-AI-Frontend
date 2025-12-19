'use client'

import React from 'react'
import { t } from '@/i18n'

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
  return (
    <button 
      type="button"
      disabled={disabled || loading}
      className={`flex w-full h-[54px] items-center justify-center gap-2.5 px-[74px] py-[18px] relative rounded-xl hover:bg-opacity-90 transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-tokens-color-surface-surface-button-pressed dark:bg-[color:var(--tokens-color-surface-surface-card-purple)] ${className}`}
      onClick={onClick || (() => {})}
      aria-label={text || t('auth.continueWithEmail')}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-white dark:border-[color:var(--tokens-color-surface-surface-dark)]"></div>
          <span className="relative w-fit font-SF-Pro font-normal text-[#FFFEFE] dark:text-[color:var(--tokens-color-surface-surface-dark)] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap">
            {t('common.loading')}
          </span>
        </div>
      ) : (
        <span className={`relative w-fit font-SF-Pro font-normal text-[#FFFEFE] dark:text-[color:var(--tokens-color-surface-surface-dark)] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap ${divClassName}`}>
          {text || t('auth.continueWithEmail')}
        </span>
      )}
    </button>
  )
}
