'use client'

import React from 'react'
import { ArrowDownSm } from '@/icons'
import Image from 'next/image'

interface ModelSelectionProps {
  className?: string
  divClassName?: string
}

export const ModelSelection: React.FC<ModelSelectionProps> = ({ 
  className,
  divClassName 
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center gap-1 p-2 relative rounded-[var(--premitives-corner-radius-corner-radius-2)] bg-[color:var(--tokens-color-surface-surface-button-pressed)] ${className}`}
    >
      <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
        <div
          className={`relative w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)] ${divClassName}`}
        >
          Manual
        </div>

        <ArrowDownSm color="#FFFFFF"/>
      </div>

      <div className="inline-flex items-center gap-1.5 p-1 relative flex-[0_0_auto] bg-tokens-color-surface-surface-tertiary rounded-[var(--premitives-corner-radius-corner-radius-2)]">
        <Image
          className="relative w-[16.5px] h-[16.5px] ml-[-0.25px] aspect-[1]"
          alt="Vector"
          src="/img/vector-1.svg"
          width={16.5}
          height={16.5}
        />

        <div className="relative w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
          Claude
        </div>
      </div>
    </div>
  )
}
