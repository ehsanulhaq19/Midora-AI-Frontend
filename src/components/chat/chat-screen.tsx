'use client'

import React from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LogoOnly } from '@/icons'
import { t } from '@/i18n'
import { LogoutButton } from './logout-button'

export const ChatScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-tokens-color-surface-surface-primary flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-tokens-color-border-border-primary">
        {/* Logo */}
        <div className="flex items-center">
          <LogoOnly className="!h-8 !w-auto" />
        </div>
        
        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-tokens-color-text-text-secondary">
            {t('common.theme')}
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-tokens-color-text-text-primary mb-4">
              {t('chat.welcomeTitle')}
            </h1>
            <p className="text-lg text-tokens-color-text-text-secondary">
              {t('chat.welcomeMessage')}
            </p>
          </div>
          
          <div className="bg-tokens-color-surface-surface-secondary rounded-lg p-6 border border-tokens-color-border-border-primary">
            <p className="text-tokens-color-text-text-inactive-2">
              {t('chat.gettingStarted')}
            </p>
          </div>
        </div>
      </main>

      {/* Footer with Logout Button */}
      <footer className="p-4 border-t border-tokens-color-border-border-primary">
        <div className="flex justify-start">
          <LogoutButton />
        </div>
      </footer>
    </div>
  )
}
