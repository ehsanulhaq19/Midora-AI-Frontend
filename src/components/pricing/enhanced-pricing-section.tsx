'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EnhancedPricingCard } from './enhanced-pricing-card'
import { PricingPlan } from '@/types/pricing'
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans'
import { SubscriptionPlan } from '@/api/subscription-plans/types'
import { useToast } from '@/hooks/use-toast'
import { CancelSubscriptionModal } from './cancel-subscription-modal'
import { CancelSuccessModal } from './cancel-success-modal'
import { SubscriptionSwitchModal } from './subscription-switch-modal'

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
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showSwitchModal, setShowSwitchModal] = useState(false)
  const [cancelPlan, setCancelPlan] = useState<SubscriptionPlan | null>(null)
  const [switchPlan, setSwitchPlan] = useState<SubscriptionPlan | null>(null)
  const [isCanceling, setIsCanceling] = useState(false)
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
    // Load active subscription on component mount
    if (!hasLoadedSubscriptionRef.current) {
      hasLoadedSubscriptionRef.current = true
      loadActiveSubscription().catch((err) => {
        // Only reset on actual errors, not on "not found" (which returns null, not an error)
        // If an error was thrown, it means there was a real error (network, server, etc.)
        // SUBSCRIPTION_NOT_FOUND returns null without throwing, so this catch won't execute for that case
        console.error('Error loading subscription:', err)
        hasLoadedSubscriptionRef.current = false
      })
    }
  }, [loadActiveSubscription]) // Include loadActiveSubscription in dependencies
  


  const handleButtonClick = (plan: SubscriptionPlan) => {
    // Check if user has an active subscription (non-Free plan)
    if (activeSubscription && activeSubscription.plan) {
      const currentPlanName = activeSubscription.plan.name || ''
      const isFreePlan = currentPlanName.toLowerCase() === 'free'
      
      // If current plan is not Free and user is trying to buy a different plan
      if (!isFreePlan && plan.uuid !== activeSubscription.plan.uuid) {
        setSwitchPlan(plan)
        setShowSwitchModal(true)
        return
      }
    }
    
    // Proceed with normal checkout flow
    selectPlan(plan)
    router.push(`/checkout?plan=${plan.uuid}`)
  }

  const handleSwitchProceed = () => {
    if (switchPlan) {
      selectPlan(switchPlan)
      setShowSwitchModal(false)
      router.push(`/checkout?plan=${switchPlan.uuid}`)
      setSwitchPlan(null)
    }
  }

  const handleCancelClick = (plan: SubscriptionPlan) => {
    if (!activeSubscription) return
    setCancelPlan(plan)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (!activeSubscription || !cancelPlan) return
    
    setIsCanceling(true)
    try {
      await cancelSubscription(activeSubscription.uuid)
      setShowCancelModal(false)
      setShowSuccessModal(true)
      // Reset the ref so subscription can be reloaded
      hasLoadedSubscriptionRef.current = false
      await loadActiveSubscription()
    } catch (error) {
      // Error already handled in hook
      setShowCancelModal(false)
    } finally {
      setIsCanceling(false)
      setCancelPlan(null)
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
    <>
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setCancelPlan(null)
        }}
        onConfirm={handleConfirmCancel}
        planName={cancelPlan?.name || ''}
        isLoading={isCanceling}
      />
      <CancelSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <SubscriptionSwitchModal
        isOpen={showSwitchModal}
        onClose={() => {
          setShowSwitchModal(false)
          setSwitchPlan(null)
        }}
        onProceed={handleSwitchProceed}
        currentPlanName={activeSubscription?.plan?.name || ''}
        newPlanName={switchPlan?.name || ''}
      />
      <div className="w-full max-w-[1400px] mx-auto px-4">
      {/* Desktop: 3 cards in one line */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-[48px_48px] relative self-stretch w-full flex-[0_0_auto]">
        {plans.map((plan) => {
          const displayPlan = mapPlanToPricingPlan(plan)
          const isCurrent = plan.uuid === currentPlanId
          const renewalDate = isCurrent && activeSubscription?.current_period_end 
            ? activeSubscription.current_period_end 
            : null
          return (
            <EnhancedPricingCard 
              key={plan.uuid} 
              plan={displayPlan}
              isCurrentPlan={isCurrent}
              onClick={() => {}}
              onButtonClick={() => handleButtonClick(plan)}
              onCancelClick={() => handleCancelClick(plan)}
              showCancelButton={isCurrent && !!activeSubscription}
              renewalDate={renewalDate}
            />
          )
        })}
      </div>

      {/* Mobile & Tablet: Stacked vertically */}
      <div className="flex lg:hidden flex-col items-center justify-center gap-6 relative self-stretch w-full">
        {plans.map((plan) => {
          const displayPlan = mapPlanToPricingPlan(plan)
          const isCurrent = plan.uuid === currentPlanId
          const renewalDate = isCurrent && activeSubscription?.current_period_end 
            ? activeSubscription.current_period_end 
            : null
          return (
            <EnhancedPricingCard 
              key={plan.uuid} 
              plan={displayPlan}
              isCurrentPlan={isCurrent}
              onClick={() => {}}
              onButtonClick={() => handleButtonClick(plan)}
              onCancelClick={() => handleCancelClick(plan)}
              showCancelButton={isCurrent && !!activeSubscription}
              renewalDate={renewalDate}
            />
          )
        })}
      </div>
    </div>
    </>
  )
}