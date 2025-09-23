'use client'

import React from 'react'
import { ArrowUpSm, Plus01_5 } from '@/icons'

interface NewChatProps {
  property1?: 'add' | 'upload'
  className?: string
}

export const NewChat: React.FC<NewChatProps> = ({ 
  property1 = 'add', 
  className = '' 
}) => {
  return (
    <div
      className={`w-9 flex aspect-[1] items-center gap-2.5 p-2.5 h-9 rounded-[var(--premitives-corner-radius-corner-radius)] justify-center bg-tokens-color-icon-surface-icon-inactive-brand relative ${className}`}
    >
      {property1 === "add" && (
        <Plus01_5
          className="!relative !w-6 !h-6 !mt-[-4.00px] !mb-[-4.00px] !ml-[-4.00px] !mr-[-4.00px]"
          color="white"
        />
      )}

      {property1 === "upload" && (
        <ArrowUpSm
          className="!relative !w-6 !h-6 !mt-[-4.00px] !mb-[-4.00px] !ml-[-4.00px] !mr-[-4.00px]"
          color="white"
        />
      )}
    </div>
  )
}
