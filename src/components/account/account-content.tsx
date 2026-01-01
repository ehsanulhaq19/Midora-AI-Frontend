'use client'

import React from 'react'
import { AccountSection as AccountSectionType } from './account-sidebar'
import { AccountSection } from './sections/account-section'
import { ProfileSection } from './sections/profile-section'
import { LanguageSection } from './sections/language-section'
import { BillingSection } from './sections/billing-section'
import { NotificationsSection } from './sections/notifications-section'
import { UsageSection } from './sections/usage-section'

interface AccountContentProps {
  section: AccountSectionType
  onLoadingChange?: (isLoading: boolean) => void
}

export const AccountContent: React.FC<AccountContentProps> = ({ section, onLoadingChange }) => {
  switch (section) {
    case 'account':
      return <AccountSection />
    case 'profile':
      return <ProfileSection />
    case 'language':
      return <LanguageSection onLoadingChange={onLoadingChange} />
    case 'subscription':
      return <BillingSection />
    case 'notifications':
      return <NotificationsSection />
    case 'usage':
      return <UsageSection />
    default:
      return null
  }
}