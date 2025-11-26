'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EnhancedPricingCard } from './enhanced-pricing-card'
import { PricingPlan } from '@/types/pricing'

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'lite-1',
    name: 'Lite',
    description: 'Intelligence for everyday tasks',
    price: 15,
    currency: '$',
    period: '/month',
    features: [
      { text: 'Messages: 4,000 SM + 250 UPM' },
      { text: '5 images, 2 audio mins, 50 doc pages' },
      { text: 'Light users who want to try AI assistance.' },
      { text: 'Support: Community support only' }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    description: 'Intelligence for everyday tasks',
    price: 15,
    currency: '$',
    period: '/month',
    features: [
      { text: 'Messages: 4,000 SM + 250 UPM' },
      { text: '5 images, 2 audio mins, 50 doc pages' },
      { text: 'Light users who want to try AI assistance.' },
      { text: 'Support: Community support only' }
    ]
  },
  {
    id: 'lite-2',
    name: 'Lite',
    description: 'Intelligence for everyday tasks',
    price: 15,
    currency: '$',
    period: '/month',
    features: [
      { text: 'Messages: 4,000 SM + 250 UPM' },
      { text: '5 images, 2 audio mins, 50 doc pages' },
      { text: 'Light users who want to try AI assistance.' },
      { text: 'Support: Community support only' }
    ]
  }
]

export const EnhancedPricingSection: React.FC = () => {
  const router = useRouter()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const currentPlanId = 'lite-1' // This should come from user data
  
  const handleCardClick = (planId: string) => {
    setSelectedPlanId(planId === selectedPlanId ? null : planId)
  }

  const handleButtonClick = (planId: string) => {
    // Navigate to checkout with plan ID
    router.push(`/checkout?plan=${planId}`)
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      {/* Desktop: 3 cards in one line */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-[48px_48px] relative self-stretch w-full flex-[0_0_auto]">
        {PRICING_PLANS.map((plan) => (
          <EnhancedPricingCard 
            key={plan.id} 
            plan={plan}
            isCurrentPlan={plan.id === currentPlanId}
            isSelected={plan.id === selectedPlanId}
            onClick={() => handleCardClick(plan.id)}
            onButtonClick={() => handleButtonClick(plan.id)}
          />
        ))}
      </div>

      {/* Mobile & Tablet: Stacked vertically */}
      <div className="flex lg:hidden flex-col items-center justify-center gap-6 relative self-stretch w-full">
        {PRICING_PLANS.map((plan) => (
          <EnhancedPricingCard 
            key={plan.id} 
            plan={plan}
            isCurrentPlan={plan.id === currentPlanId}
            isSelected={plan.id === selectedPlanId}
            onClick={() => handleCardClick(plan.id)}
            onButtonClick={() => handleButtonClick(plan.id)}
          />
        ))}
      </div>
    </div>
  )
}