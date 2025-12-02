'use client'

import React from 'react'
import { AccountIcon, ProfileIcon, LanguageIcon, BillingIcon, NotificationsIcon } from '@/icons'

export type AccountSection = 'account' | 'profile' | 'language' | 'sunscription' | 'notifications'

interface AccountSidebarProps {
  activeSection: AccountSection
  onSectionChange: (section: AccountSection) => void
  onClose?: () => void
}

const menuItems: Array<{ id: AccountSection; label: string; icon: (isActive: boolean) => React.ReactNode }> = [
  {
    id: 'account',
    label: 'Account',
    icon: (isActive) => <AccountIcon color={isActive ? "var(--tokens-color-text-text-brand)" : "#000000"} />
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (isActive) => <ProfileIcon color={isActive ? "var(--tokens-color-text-text-brand)" : "#000000"} />
  },
  {
    id: 'language',
    label: 'Language',
    icon: (isActive) => <LanguageIcon color={isActive ? "var(--tokens-color-text-text-brand)" : "#000000"} />
  },
  {
    id: 'sunscription',
    label: 'Sunscription',
    icon: (isActive) => <BillingIcon color={isActive ? "var(--tokens-color-text-text-brand)" : "#000000"} />
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (isActive) => <NotificationsIcon color={isActive ? "var(--tokens-color-text-text-brand)" : "#000000"} />
  }
]

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeSection,
  onSectionChange,
  onClose
}) => {
  return (
    <div className="w-[271px] h-full bg-[var(--Color-Icon-Icon-Neutral)] backdrop-blur-[2.91px] border-[#EFEFF5] flex flex-col">
      <div className="flex flex-col px-[20px] py-9 mt-6">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center gap-5 px-3 py-3 rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors text-left w-full ${
                isActive
                  ? 'bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-brand)]'
                  : 'text-[color:var(--light-mode-colors-dark-gray-900)]'
              }`}
            >
              <div className="flex-shrink-0 w-5 h-5">
                {item.icon(isActive)}
              </div>
              <span className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[16px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] ${
                isActive
                  ? 'text-[color:var(--tokens-color-text-text-brand)]'
                  : 'text-[color:var(--light-mode-colors-dark-gray-900)]'
              }`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}