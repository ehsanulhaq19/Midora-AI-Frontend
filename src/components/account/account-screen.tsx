'use client'

import React, { useState } from 'react'
import { AccountSidebar, AccountSection } from './account-sidebar'
import { AccountContent } from './account-content'
import { Close } from '@/icons'

interface AccountScreenProps {
  onClose?: () => void
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<AccountSection>('account')

  return (
    <div className="w-full h-full bg-[#F8F8FC] flex">
      {/* Account Sidebar - 30% width */}
      <AccountSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onClose={onClose}
      />

      {/* Account Content - 70% width */}
      <div className="flex-1 flex flex-col overflow-y-auto relative bg-[#F8F8FC]">
        <AccountContent section={activeSection} />
        
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#EFEFF5] transition-colors z-10"
            aria-label="Close"
          >
            <Close className="w-5 h-5 text-[color:var(--tokens-color-text-text-primary)]" />
          </button>
        )}
      </div>
    </div>
  )
}