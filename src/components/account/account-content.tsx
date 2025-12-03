'use client'

import React from 'react'
import { AccountSection as AccountSectionType } from './account-sidebar'
import { AccountSection } from './sections/account-section'
import { ProfileSection } from './sections/profile-section'
import { LanguageSection } from './sections/language-section'
import { BillingSection } from './sections/billing-section'
import { NotificationsSection } from './sections/notifications-section'

interface AccountContentProps {
  section: AccountSectionType
}

export const AccountContent: React.FC<AccountContentProps> = ({ section }) => {
  switch (section) {
    case 'account':
      return <AccountSection />
    case 'profile':
      return <ProfileSection />
    case 'language':
      return <LanguageSection />
    case 'subscription':
      return <BillingSection />
    case 'notifications':
      return <NotificationsSection />
    default:
      return null
  }
}