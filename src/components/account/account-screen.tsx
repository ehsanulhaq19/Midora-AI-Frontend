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
    <div className="w-full h-full sm:gap-4 bg-[color:var(--tokens-color-surface-surface-primary)] flex relative z-0 pointer-events-auto">
      {/* Account Sidebar - Narrow on mobile (icons only), wider on desktop */}
      <div className="w-[70px] lg:w-[30%] lg:max-w-[300px] flex-shrink-0">
        <AccountSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onClose={onClose}
        />
      </div>

      {/* Account Content - 70% width */}
      <div className="flex-1 flex flex-col overflow-y-auto relative bg-[color:var(--tokens-color-surface-surface-primary)] z-0">
        <AccountContent section={activeSection} />
        
        {/* Close button */}
        {/* {onClose && (
          <button
            onClick={onClose}
            className="absolute top-0 right-4 rounded-lg hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors z-10"
            aria-label="Close"
          >
            <Close className="w-5 h-5 " style={{ color: 'var(--tokens-color-text-text-primary)' }} />
          </button>
        )} */}
      </div>
    </div>
  )
}