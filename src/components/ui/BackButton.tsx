'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightSm } from '@/icons'
import { ActionButton } from './buttons/action-button'

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
    <ActionButton
      onClick={handleClick}
      variant="ghost"
      size="sm"
      className={`!w-10 !h-10 !p-0 !min-w-0 !rounded-lg hover:!bg-tokens-color-surface-surface-tertiary focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-tokens-color-text-text-brand ${className}`}
      aria-label="Go back"
      type="button"
      leftIcon={
        <ArrowRightSm 
          className="relative w-5 h-5 rotate-180" 
          color="var(--tokens-color-text-text-primary)" 
        />
      }
    >
      <span className="sr-only">Go back</span>
    </ActionButton>
  )
}

