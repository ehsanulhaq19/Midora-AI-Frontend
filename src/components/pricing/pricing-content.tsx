'use client'

import React from 'react'
import { EnhancedPricingSection } from './enhanced-pricing-section'
import { BackButton } from '../ui'

export const PricingContent: React.FC = () => {
  return (
    <div className="flex-1 p-6 lg:p-12 flex flex-col overflow-y-auto bg-[color:var(--tokens-color-surface-surface-primary)]">
      <div className='mb-6'><BackButton /></div>
      <div className="flex-1 flex items-center justify-center ">
        <EnhancedPricingSection />
      </div>
    </div>
  )
}