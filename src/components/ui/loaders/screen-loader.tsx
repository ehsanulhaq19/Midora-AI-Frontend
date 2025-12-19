'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LogoOnly } from '@/icons/logo-only'
import { useTheme } from '@/hooks/use-theme'

interface ScreenLoaderProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

/**
 * Elegant screen loader component with purple theme
 * Clean design with smooth animations and no shadows
 */
export const ScreenLoader: React.FC<ScreenLoaderProps> = ({
  message = 'Loading...',
  className,
  size = 'lg',
  fullScreen = true
}) => {
  const { resolvedTheme } = useTheme()
  // To avoid SSR/client hydration mismatches, derive theme purely from React state.
  // The initial value will match the server-rendered markup, and client-side theme
  // changes are handled by the ThemeProvider effects.
  const isDark = resolvedTheme === 'dark'

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const borderClasses = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-3'
  }

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-6',
      className
    )}>
      {/* Logo with circular animation */}
      <div className="relative">
        <div className="w-16 h-16 animate-spin" style={{ animation: 'spin 3s linear infinite' }}>
          {isDark ? (
            <img src="/img/dark_logo.svg" alt="Logo" className="w-full h-full" />
          ) : (
            <LogoOnly className="w-full h-full" />
          )}
        </div>
      </div>
      
      {/* Loading message with elegant typography */}
      <p className={`text-sm font-medium text-center max-w-xs leading-relaxed ${isDark ? 'text-white' : 'text-gray-600'}`}>
        {message}
      </p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)]' : 'bg-white'}`}>
        <div className={`rounded-xl p-8 ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)]' : 'bg-white'}`}>
          {content}
        </div>
      </div>
    )
  }

  return content
}

export default ScreenLoader
