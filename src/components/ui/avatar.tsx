import React from 'react'
import Image from 'next/image'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  type?: 'image' | 'initials'
  indicator?: 'none' | 'online' | 'offline'
  src?: string
  alt?: string
  className?: string
  fallbackText?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  type = 'image',
  indicator = 'none',
  src,
  alt = 'Avatar',
  className = '',
  fallbackText = 'U'
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
