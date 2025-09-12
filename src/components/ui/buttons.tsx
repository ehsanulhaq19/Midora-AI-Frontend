'use client'

import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
        ghost: 'hover:bg-secondary-100 hover:text-secondary-900',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-8',
        sm: 'h-9 px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

interface PrimaryButtonProps {
  property1?: 'pressed'
  className?: string
  text?: string
  onClick?: () => void
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ property1, className, text, onClick }) => {
  return (
    <button 
      type="button"
      className={`flex w-full max-w-[360px] h-[54px] items-center justify-center gap-2.5 px-[74px] py-[18px] relative bg-tokens-color-surface-surface-button-pressed rounded-xl hover:bg-opacity-90 transition-colors duration-200 focus:outline-none ${className}`}
      onClick={onClick || (() => {})}
      aria-label={text || "Continue with email"}
    >
      <span className="relative w-fit mt-[-1.50px] font-body-primary font-normal text-[#fffdfd] text-base tracking-[-0.48px] leading-[normal] whitespace-nowrap">
        {text || "Continue with email"}
      </span>
    </button>
  )
}

export { Button, buttonVariants, PrimaryButton as Buttons }
