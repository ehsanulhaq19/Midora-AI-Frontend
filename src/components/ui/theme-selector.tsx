'use client'

import React, { useState } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { DownArrow } from '@/icons'

interface ThemeSelectorProps {
  className?: string
  compact?: boolean
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  className = '',
  compact = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  if (compact) {
    // Compact version for sidebar
    return (
      <div className={`relative ${className}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          className={`flex h-9 items-center gap-2 px-3 py-2 pr-8 rounded-lg border bg-transparent transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-1 outline-none font-h02-heading02 text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] appearance-none w-full cursor-pointer text-[color:var(--tokens-color-text-text-primary)]`}
          style={{
            borderColor: isOpen
              ? 'var(--tokens-color-text-text-seconary)'
              : isDark
                ? 'var(--tokens-color-border-border-inactive)'
                : '#dbdbdb',
            backgroundColor: isDark ? 'var(--tokens-color-surface-surface-card-default)' : 'var(--tokens-color-surface-surface-primary)'
          }}
        >
          <option value="light" className="text-black">Light</option>
          <option value="dark" className="text-black">Dark</option>
          <option value="system" className="text-black">System</option>
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200">
          <DownArrow
            className={`transition-transform flex-shrink-0 w-4 h-4 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ color: 'var(--tokens-color-text-text-primary)' }}
          />
        </div>
      </div>
    )
  }

  // Full version for account section and other places
  return (
    <div className={`relative ${className}`}>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className={`flex h-[54px] items-center gap-3 px-6 py-3 pr-12 rounded-xl border bg-transparent transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] appearance-none w-full cursor-pointer text-[color:var(--tokens-color-text-text-primary)]`}
        style={{
          borderColor: isOpen
            ? 'var(--tokens-color-text-text-seconary)'
            : isDark
              ? 'var(--tokens-color-border-border-inactive)'
              : '#dbdbdb',
          backgroundColor: isDark ? 'var(--tokens-color-surface-surface-card-default)' : undefined
        }}
      >
        <option value="light" className="text-black">Light</option>
        <option value="dark" className="text-black">Dark</option>
        <option value="system" className="text-black">System</option>
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200">
        <DownArrow
          className={`transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: 'var(--tokens-color-text-text-primary)' }}
        />
      </div>
    </div>
  )
}

