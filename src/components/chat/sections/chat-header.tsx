'use client'

import React from 'react'
import { ModelSelection } from './model-selection'

export const ChatHeader: React.FC = () => {
  return (
    <div className="flex items-start justify-between relative w-full px-[24px] lg:px-[24px] pl-[64px] py-4">
      <div className="flex items-center gap-4">
        <ModelSelection />
      </div>

      <div className="flex items-center gap-2">{/* Reserved for future actions */}</div>
    </div>
  )
}
