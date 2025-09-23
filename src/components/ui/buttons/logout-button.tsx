'use client'

import React from 'react'
import { Button } from './button'
import { Logout } from '@/icons'
import { useLogout } from '@/hooks/useLogout'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'lg' | 'sm' | 'icon'
  showIcon?: boolean
  showText?: boolean
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  variant = 'ghost',
  size = 'default',
  showIcon = true,
  showText = true,
}) => {
  const { logoutUser } = useLogout()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={cn(
        'flex items-center gap-2 text-left justify-start w-full',
        'hover:bg-red-50 hover:text-red-600 transition-colors',
        className
      )}
    >
      {showIcon && (
        <Logout
          className="!relative !w-5 !h-5"
          color="currentColor"
          opacity="1"
        />
      )}
      {showText && (
        <span className="font-medium">
          {t('auth.logout')}
        </span>
      )}
    </Button>
  )
}
