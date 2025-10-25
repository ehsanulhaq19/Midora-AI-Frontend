'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'
import { IconButton } from '@/components/ui/buttons'
import { Lightbulb, MinusSquare } from '@/icons'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <IconButton
      variant="ghost"
      size="md"
      icon={theme === 'light' ? <MinusSquare className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    />
  )
}