'use client'

import React from 'react'
import { Menu } from '@/icons'
import { ModelSelection } from './model-selection'
import { MessageInput } from './message-input'
import { LogoOnly } from '@/icons'
import { t, tWithParams } from '@/i18n'
import { useAuthRedux } from '@/hooks/useAuthRedux'

interface ChatInterfaceProps {
  onMenuClick: () => void
  onSendMessage: (message: string, modelUuid?: string) => void
  isCompact?: boolean
  isStreaming?: boolean
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onMenuClick, 
  onSendMessage,
  isCompact = false,
  isStreaming = false
}) => {
  const { userName } = useAuthRedux()
  
  if (isCompact) {
    return (
      <div className="w-full max-w-[808px] max-h-[106px] mx-auto p-4">
        <MessageInput onSend={onSendMessage} isStreaming={isStreaming} className="max-w-[808px]" textAreaClassName="!text-[length:var(--text-medium-font-size)]"/>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-[246px] px-4 lg:px-0 py-6 relative flex-1 grow min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between relative w-full px-[28px]">
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

      {/* Welcome Section */}
      <div className="flex flex-col w-full max-w-[808px] items-center gap-6 relative flex-[0_0_auto] mx-auto">
        <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
          <div className="flex flex-col w-[37px] h-9 items-start gap-2.5 relative aspect-[1.02]">
            <LogoOnly className="relative self-stretch w-full mb-[-0.45px] aspect-[1.02]" />
          </div>
          <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--h02-heading02-font-size)] tracking-[var(--h02-heading02-letter-spacing)] leading-[var(--h02-heading02-line-height)] text-center [font-style:var(--h02-heading02-font-style)]">
            {tWithParams('chat.welcomeBack', { name: userName })}
          </p>
        </div>

        <MessageInput onSend={onSendMessage} isStreaming={isStreaming} />
      </div>
    </div>
  )
}
