'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightSm } from '@/icons'

interface BackButtonProps {
  className?: string
  onClick?: () => void
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className = '',
  onClick 
}) => {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Use browser back navigation
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-10 h-10 rounded-lg hover:bg-tokens-color-surface-surface-tertiary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tokens-color-text-text-brand ${className}`}
      aria-label="Go back"
      type="button"
    >
      <ArrowRightSm 
        className="relative w-7 h-7 rotate-180" 
        color="var(--tokens-color-text-text-primary)" 
      />
    </button>
  )
}

