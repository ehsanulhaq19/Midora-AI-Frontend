'use client'

import React from 'react'
import { Spinner } from './spinner'
import { cn } from '@/lib/utils'

interface ButtonLoaderProps {
  loading?: boolean
  children: React.ReactNode
  className?: string
  spinnerSize?: 'sm' | 'md' | 'lg'
  spinnerColor?: 'primary' | 'white' | 'gray'
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  loading = false,
  children,
  className,
  spinnerSize = 'sm',
  spinnerColor = 'white'
}) => {
  if (!loading) {
    return <>{children}</>
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size={spinnerSize} color={spinnerColor} />
      <span>Loading...</span>
    </div>
  )
}
