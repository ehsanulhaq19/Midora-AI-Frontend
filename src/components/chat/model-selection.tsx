'use client'

import React from 'react'
import { DownArrowSm } from '@/icons'
import { t } from '@/i18n'

interface ModelSelectionProps {
  property1?: 'frame-105'
  className?: string
  divClassName?: string
}

export const ModelSelection: React.FC<ModelSelectionProps> = ({ 
  property1, 
  className = '', 
  divClassName = '' 
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center gap-1 p-2 rounded-[var(--premitives-corner-radius-corner-radius-2)] bg-[linear-gradient(109deg,rgba(31,23,64,1)_0%,rgba(80,60,166,1)_100%)] bg-tokens-color-surface-surface-button-pressed ${className}`}
    >
      <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
        <div
          className={`relative w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)] ${divClassName}`}
        >
          {t('chat.manual')}
        </div>

        <DownArrowSm
          className="!relative !w-[18px] !h-[18px] !aspect-[1]"
          color="white"
        />
      </div>

      <div className="inline-flex items-center gap-1.5 p-1 relative flex-[0_0_auto] bg-tokens-color-surface-surface-tertiary rounded-[var(--premitives-corner-radius-corner-radius-2)]">
        <img
          className="relative w-[16.5px] h-[16.5px] ml-[-0.25px] aspect-[1]"
          alt="Vector"
          src="/img/vector.svg"
        />

        <div className="relative w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
          {t('chat.claude')}
        </div>
      </div>
    </div>
  )
}
