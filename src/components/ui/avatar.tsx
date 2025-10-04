import React from 'react'
import Image from 'next/image'
import { LogoOnly } from '@/icons/logo-only'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  type?: 'image' | 'initials' | 'auto'
  indicator?: 'none' | 'online' | 'offline'
  src?: string
  alt?: string
  className?: string
  fallbackText?: string
  showLabel?: boolean
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  type = 'image',
  indicator = 'none',
  src,
  alt = 'Avatar',
  className = '',
  fallbackText = 'U',
  showLabel = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const indicatorClasses = {
    none: '',
    online: 'ring-2 ring-green-500',
    offline: 'ring-2 ring-gray-400'
  }

  const baseClasses = `relative rounded-full overflow-hidden ${sizeClasses[size]} ${indicatorClasses[indicator]} ${className}`

  if (type === 'auto') {
    return (
      <div className="flex items-center gap-2">
        <div className={baseClasses}>
          <LogoOnly 
            color="#FFFFFF" 
            className="w-full h-full object-cover"
          />
        </div>
        {showLabel && (
          <span className="font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
            Midroa AI
          </span>
        )}
      </div>
    )
  }

  if (type === 'image' && src) {
    return (
      <div className={baseClasses}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className={`${baseClasses} bg-tokens-color-surface-surface-secondary flex items-center justify-center`}>
      <span className="text-tokens-color-text-text-primary font-medium">
        {fallbackText}
      </span>
    </div>
  )
}
