'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EnhancedPricingCard } from './enhanced-pricing-card'
import { PricingPlan } from '@/types/pricing'
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans'
import { SubscriptionPlan } from '@/api/subscription-plans/types'
import { useToast } from '@/hooks/use-toast'

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
}

const getCurrencySymbol = (currency?: string): string => {
  if (!currency) return '$'
  const upperCurrency = currency.toUpperCase()
  return currencySymbols[upperCurrency] || currency
}

const formatNumber = (value?: number | null): string => {
  if (typeof value !== 'number') return '0'
  return value.toLocaleString()
}

const mapPlanToPricingPlan = (plan: SubscriptionPlan): PricingPlan => {
  const features: PricingPlan['features'] = [
    { text: `${formatNumber(plan.credits_per_month)} credits/month` },
    { text: `${plan.file_storage_gb ?? 0} GB file storage` },
    { text: `${formatNumber(plan.vector_storage_entries)} vector entries` },
  ]

  if (plan.team_user_limit) {
    features.push({ text: `${plan.team_user_limit} team seats included` })
  }

  if (plan.priority_support) {
    features.push({ text: 'Priority support' })
  }

  if (plan.api_access && plan.api_access !== 'none') {
    features.push({ text: `API access: ${plan.api_access}` })
  }

  return {
    id: plan.uuid,
    name: plan.name,
    description: plan.description || 'Intelligence for everyday tasks',
    price: plan.monthly_price,
    currency: getCurrencySymbol(plan.currency),
    period: '/month',
    features,
  }
}

export const EnhancedPricingSection: React.FC = () => {
  const router = useRouter()
  const {
    plans,
    loadPlans,
    selectPlan,
    selectedPlan,
    activeSubscription,
    loadActiveSubscription,
    cancelSubscription,
    isLoading,
  } = useSubscriptionPlans()
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const hasLoadedPlansRef = useRef(false)
  const hasLoadedSubscriptionRef = useRef(false)
  const currentPlanId = activeSubscription?.plan?.uuid ?? null

  useEffect(() => {
    if (!hasLoadedPlansRef.current && plans.length === 0 && !isLoading) {
      hasLoadedPlansRef.current = true
      loadPlans(true).catch(() => {
        hasLoadedPlansRef.current = false
      })
    }
  }, [plans.length, isLoading, loadPlans])

  useEffect(() => {
    if (!hasLoadedSubscriptionRef.current) {
      hasLoadedSubscriptionRef.current = true
      loadActiveSubscription().catch((err) => {
        // Only reset on actual errors, not on "not found" (which returns null, not an error)
        // If an error was thrown, it means there was a real error (network, server, etc.)
        // SUBSCRIPTION_NOT_FOUND returns null without throwing, so this catch won't execute for that case
        console.error('Error loading subscription:', err)
      })
    }
  }, []) // Empty dependency array - only run once on mount

  useEffect(() => {
    setSelectedPlanId(selectedPlan?.uuid ?? null)
  }, [selectedPlan])
  
  const handleCardClick = (planId: string) => {
    setSelectedPlanId((prev) => (planId === prev ? null : planId))
  }

  const handleButtonClick = (plan: SubscriptionPlan) => {
    selectPlan(plan)
    router.push(`/checkout?plan=${plan.uuid}`)
  }

  const handleCancelClick = async (plan: SubscriptionPlan) => {
    if (!activeSubscription) return
    
    if (window.confirm(`Are you sure you want to cancel your ${plan.name} subscription?`)) {
      try {
        await cancelSubscription(activeSubscription.uuid)
        showSuccessToast('Subscription Canceled', 'Your subscription has been canceled successfully.')
        await loadActiveSubscription()
      } catch (error) {
        // Error already handled in hook
      }
    }
  }

  if (isLoading && plans.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!plans.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-lg text-[color:var(--tokens-color-text-text-seconary)]">
          Subscription plans are unavailable right now.
        </p>
        <button
          onClick={() => {
            if (!isLoading) {
              loadPlans(true).catch(() => {
                hasLoadedPlansRef.current = false
              })
            }
          }}
          className="px-4 py-2 rounded-md bg-[color:var(--premitives-color-brand-purple-1000)] text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      {/* Desktop: 3 cards in one line */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-[48px_48px] relative self-stretch w-full flex-[0_0_auto]">
        {plans.map((plan) => {
          const displayPlan = mapPlanToPricingPlan(plan)
          return (
            <EnhancedPricingCard 
              key={plan.uuid} 
              plan={displayPlan}
              isCurrentPlan={plan.uuid === currentPlanId}
              isSelected={plan.uuid === selectedPlanId}
              onClick={() => handleCardClick(plan.uuid)}
              onButtonClick={() => handleButtonClick(plan)}
              onCancelClick={() => handleCancelClick(plan)}
              showCancelButton={true}
            />
          )
        })}
      </div>

      {/* Mobile & Tablet: Stacked vertically */}
      <div className="flex lg:hidden flex-col items-center justify-center gap-6 relative self-stretch w-full">
        {plans.map((plan) => {
          const displayPlan = mapPlanToPricingPlan(plan)
          return (
            <EnhancedPricingCard 
              key={plan.uuid} 
              plan={displayPlan}
              isCurrentPlan={plan.uuid === currentPlanId}
              isSelected={plan.uuid === selectedPlanId}
              onClick={() => handleCardClick(plan.uuid)}
              onButtonClick={() => handleButtonClick(plan)}
              onCancelClick={() => handleCancelClick(plan)}
              showCancelButton={true}
            />
          )
        })}
      </div>
    </div>
  )
}