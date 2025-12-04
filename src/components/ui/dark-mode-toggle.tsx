'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'

export const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#181818]
        ${isDark ? 'bg-white/20' : 'bg-gray-300'}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      {/* Toggle thumb with glow effect */}
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 ease-in-out
          shadow-lg
          ${isDark ? 'translate-x-6' : 'translate-x-0.5'}
          ${isDark ? 'shadow-white/50' : 'shadow-gray-400/50'}
        `}
        style={{
          boxShadow: isDark
            ? '0 0 8px rgba(255, 255, 255, 0.4), 0 0 12px rgba(255, 255, 255, 0.2)'
            : '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
      
      {/* Subtle glow background when active */}
      {isDark && (
        <span
          className="absolute inset-0 rounded-full bg-white/10 blur-sm"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}
    </button>
  )
}

