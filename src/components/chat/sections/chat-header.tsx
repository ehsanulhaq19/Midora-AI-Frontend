'use client'

import React from 'react'
import { Menu } from '@/icons'
import { ModelSelection } from './model-selection'
import { t } from '@/i18n'

interface ChatHeaderProps {
  onMenuClick: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onMenuClick }) => {
  return (
    <div className="flex items-start justify-between relative w-full px-[28px] py-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-[color:var(--tokens-color-surface-surface-secondary)] rounded transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <ModelSelection />
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:inline-flex items-center justify-center gap-2 p-3 bg-[color:var(--premitives-color-brand-purple-1000)] rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:bg-[color:var(--tokens-color-surface-surface-button-pressed)] transition-colors">
          <div className="relative w-fit mt-[-1.00px] font-h05-heading05 font-[number:var(--h05-heading05-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--h05-heading05-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
            {t('chat.upgradeToPro')}
          </div>
        </button>
      </div>
    </div>
  )
}
