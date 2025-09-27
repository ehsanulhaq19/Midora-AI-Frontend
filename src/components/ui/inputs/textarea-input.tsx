import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'outline'
  error?: boolean
  helperText?: string
}

const textareaVariants = {
  default: 'bg-transparent border-none outline-none',
  filled: 'bg-tokens-color-surface-surface-tertiary border-none outline-none',
  outline: 'bg-transparent border border-solid border-tokens-color-border-border-inactive outline-none focus:border-tokens-color-border-border-active'
}

export const TextareaInput: React.FC<TextareaInputProps> = ({
  variant = 'default',
  error = false,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          'w-full resize-none transition-colors placeholder-[color:var(--tokens-color-text-text-brand)]',
          textareaVariants[variant],
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-red-500' : 'text-tokens-color-text-text-inactive-2'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
}
