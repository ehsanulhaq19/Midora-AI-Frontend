'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Copy } from '@/icons'

export const AccountSection: React.FC = () => {
  const { logout } = useAuth()
  const [copied, setCopied] = useState(false)

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
    <div className="flex-1 flex flex-col p-9">
      <div className="flex flex-col mt-9 bg-[#2932410D] gap-9 p-9 rounded-xl border">
        <h1
          className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[-1px] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]"
        >
          Account
        </h1>
        {/* Log out of all devices */}
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
            Log out of all devices
          </h2>
          <button
            onClick={handleLogoutAll}
            className="py-[18px] h-12 bg-[rgba(107,67,146,0.1)] px-6 flex items-center justify-center text-[color:var(--tokens-color-text-text-brand)] rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
          >
            Logout
          </button>
        </div>

        {/* Delete your account */}
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
            Delete your account
          </h2>
          <button
            onClick={handleDeleteAccount}
            className="py-[18px] gap-[10px] flex items-center justify-center h-12 px-6 bg-[color:var(--tokens-color-surface-surface-button-pressed)] text-white rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:opacity-90 transition-opacity font-[family-name:var(--text-font-family)] text-[length:var(--text-font-size)] font-[number:var(--text-font-weight)] leading-normal tracking-[-0.48px] [font-style:var(--text-font-style)]"
          >
            Delete account
          </button>
        </div>

        {/* Organization ID */}
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
            Organization ID
          </h2>
          <div className="flex items-center gap-3">
            <div className="px-4 py-3  bg-[rgba(107,67,146,0.10)]  bg-gray-100 rounded-lg border border-gray-200 min-w-[300px]">
              <span className=" font-[number:var(--text-font-weight)] text-[rgba(41,50,65,0.9)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] font-[family-name:var(--text-font-family)]">
                {organizationId}
              </span>

            </div>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-[#EFEFF5] transition-colors flex-shrink-0"
              title="Copy Organization ID"
            >
              <Copy className="w-5 h-5 text-[color:var(--tokens-color-text-text-seconary)]" />
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