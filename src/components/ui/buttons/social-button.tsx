'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'
import { GitHub, GitHubColorful, Microsoft } from '@/icons'

interface SocialButtonProps {
  provider: 'github' | 'google' | 'microsoft'
  onClick: () => void
  disabled?: boolean
  className?: string
  showLabel?: boolean
}

/**
 * Social Button Component
 * Handles dark theme internally - no isDark needed in parent components!
 */
export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onClick,
  disabled = false,
  className = '',
  showLabel = true
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const getProviderConfig = () => {
    switch (provider) {
      case 'github':
        return {
          name: 'Github',
          icon: isDark ? (
            <GitHubColorful className="relative w-6 h-6" />
          ) : (
            <GitHubColorful className="relative w-6 h-6" />
          ),
          ariaLabel: 'Sign up with Github'
        }
      case 'google':
        return {
          name: 'Google',
          icon: (
            <img
              className="relative w-6 h-6 aspect-[1] object-cover"
              alt="Google"
              src="/img/image-6.png"
            />
          ),
          ariaLabel: 'Sign up with Google'
        }
      case 'microsoft':
        return {
          name: 'Microsoft',
          icon: <Microsoft className="relative w-6 h-6" />,
          ariaLabel: 'Sign up with Microsoft'
        }
    }
  }

  const config = getProviderConfig()

  return (
    <button
      type="button"
      className={`
        inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] 
        rounded-xl border border-solid transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        border-[#dbdbdb] hover:border-[#bbb]
        dark:border-white/20 dark:hover:border-white/30
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={config.ariaLabel}
    >
      {config.icon}
      {showLabel && (
        <span className="relative hidden lg:block font-SF-Pro w-fit font-normal text-[color:var(--tokens-color-text-text-primary)] text-base tracking-[-0.48px] leading-[100%] whitespace-nowrap">
          {config.name}
        </span>
      )}
    </button>
  )
}

