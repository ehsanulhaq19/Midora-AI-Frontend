'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSubscriptionPlans } from './use-subscription-plans'
import { SubscriptionPlan } from '@/api/subscription-plans/types'

function normalize(value?: string | null) {
  return value?.toLowerCase().trim() || ''
}

export function findPlanByIdentifier(plans: SubscriptionPlan[], planId: string) {
  const normalizedId = normalize(planId)
  return plans.find((plan) => {
    const slugMatch = normalize(plan.slug) === normalizedId
    const nameMatch = normalize(plan.name) === normalizedId
    return plan.uuid === planId || slugMatch || nameMatch
  }) || null
}

/**
 * Shared checkout navigation helper used by every pricing screen.
 * Persists the selected plan in the subscription store so the checkout page
 * can render without relying on query parameters.
 */
export const useCheckoutNavigation = () => {
  const router = useRouter()
  const { plans, selectPlan, setPendingPlanId } = useSubscriptionPlans()

  const goToCheckout = useCallback((planId: string) => {
    if (!planId) {
      return
    }

    const matchingPlan = findPlanByIdentifier(plans, planId)

    selectPlan(matchingPlan)
    setPendingPlanId(planId)
    router.push('/checkout')
  }, [plans, router, selectPlan, setPendingPlanId])

  return { goToCheckout }
}

