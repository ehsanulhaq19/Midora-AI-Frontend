'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Copy } from '@/icons'
import { useTheme } from '@/hooks/use-theme'
import { ThemeSelector } from '@/components/ui/theme-selector'
import { AccountActionButton } from '@/components/ui/buttons'

export const AccountSection: React.FC = () => {
  const { logout } = useAuth()
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Mock organization ID - should come from user data
  const organizationId = '682e0044-b25c-4af4-ad14-fef3b47c158d'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organizationId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleLogoutAll = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDeleteAccount = () => {
    // TODO: Implement delete account functionality
    console.log('Delete account clicked')
  }
  return (
    <div className="flex-1 flex flex-col sm:p-9 p-4">
      <div className={`flex flex-col mt-9  p-6 sm:p-9 rounded-xl ${isDark ? '' : 'border border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'}`}>
        <h1
          className="text-[length:var(--text-large-font-size)] leading-[100%] pb-9 tracking-[-1px] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]"
        >
          Account
        </h1>
        {/* Log out of all devices */}
        <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b ${isDark ? 'border-white/90' : 'border-[color:var(--tokens-color-border-border-subtle)]'} pb-[18px] pt-[18px]`}>
          <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
            Log out of all devices
          </h2>
          <AccountActionButton onClick={handleLogoutAll} variant="secondary">
            Logout
          </AccountActionButton>
        </div>

        {/* Delete your account */}
        <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b ${isDark ? 'border-white/90' : 'border-[color:var(--tokens-color-border-border-subtle)]'} pb-[18px] pt-[18px]`}>
          <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
            Delete your account
          </h2>
          <AccountActionButton onClick={handleDeleteAccount} variant="primary">
            Delete account
          </AccountActionButton>
        </div>

        {/* Theme Selection */}
        <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b ${isDark ? 'border-white/90' : 'border-[color:var(--tokens-color-border-border-subtle)]'} pb-[18px] pt-[18px]`}>
          <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
            Theme
          </h2>
          <ThemeSelector className="w-full md:w-auto md:min-w-[200px]" />
        </div>

        {/* Organization ID */}
        <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between  ${isDark ? 'border-white/90' : ''} pt-[18px]`}>
          <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
            Organization ID
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center ">
            <div 
              className={`px-4 py-3 rounded-lg border ${
                isDark ? '' : 'bg-[color:var(--tokens-color-surface-surface-tertiary)] border-[color:var(--tokens-color-border-border-subtle)]'
              }`}
              style={isDark ? {
                backgroundColor: 'var(--tokens-color-surface-surface-card-hover)',
                borderColor: 'var(--tokens-color-border-border-subtle)'
              } : {}}
            >
              <span 
                className="font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] font-[family-name:var(--text-font-family)]"
                style={{ color: 'var(--tokens-color-text-text-primary)' }}
              >
                {organizationId}
              </span>

            </div>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors flex-shrink-0 self-start sm:self-auto"
              title="Copy Organization ID"
            >
              <Copy className="w-5 h-5" style={{ color: 'var(--tokens-color-text-text-primary)' }} />
            </button>
          </div>
        </div>
        {copied && (
          <div className="text-sm text-green-600 text-right">Copied!</div>
        )}
      </div>
    </div>
  )
}