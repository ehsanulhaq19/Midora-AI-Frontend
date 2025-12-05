import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon: React.ReactNode
  'aria-label': string
}

const iconButtonVariants = {
  default: 'bg-[color:var(--tokens-color-surface-surface-tertiary)] hover:bg-[color:var(--tokens-color-surface-surface-neutral)] text-[color:var(--tokens-color-text-text-primary)]',
  primary: 'hover:bg-opacity-90 text-white',
  secondary: 'bg-[color:var(--tokens-color-surface-surface-secondary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-primary)]',
  ghost: 'hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-primary)]',
  outline: 'border border-solid border-[color:var(--tokens-color-border-border-inactive)] hover:bg-[color:var(--tokens-color-surface-surface-neutral)] text-[color:var(--tokens-color-text-text-primary)]'
}

const iconButtonSizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-10 h-10'
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  className,
  ...props
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  // Get background color for primary variant based on theme
  const getPrimaryBgColor = () => {
    if (variant === 'primary') {
      return isDark 
        ? 'var(--tokens-color-surface-surface-card-hover)'
        : 'var(--tokens-color-surface-surface-brand)'
    }
    return undefined
  }
  
  return (
    <button
      className={cn(
        'flex items-center justify-center rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        iconButtonVariants[variant],
        iconButtonSizes[size],
        className
      )}
      style={getPrimaryBgColor() ? {
        backgroundColor: getPrimaryBgColor()
      } : {}}
      {...props}
    >
      {icon}
    </button>
  )
}
