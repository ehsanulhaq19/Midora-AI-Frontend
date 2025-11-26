import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { subscriptionPlansApi } from '@/api/subscription-plans/api'
import { SubscriptionPlan } from '@/api/subscription-plans/types'
import {
  setPlans,
  setSelectedPlan,
  setLoading,
  setError,
  clearError,
} from '@/store/slices/subscription-plans-slice'
import { useToast } from './use-toast'
import { handleApiError } from '@/lib/error-handler'

export const useSubscriptionPlans = () => {
  const dispatch = useDispatch()
  const { error: showErrorToast } = useToast()
  const {
    plans,
    selectedPlan,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.subscriptionPlans)

  /**
   * Load all subscription plans
   */
  const loadPlans = useCallback(async (activeOnly: boolean = true) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await subscriptionPlansApi.getAllPlans(activeOnly)

      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'SUBSCRIPTION_PLANS_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        dispatch(setError(response.error))
        throw new Error(JSON.stringify(errorObject))
      }

      const plansData = response.data || []
      dispatch(setPlans(plansData))
      return plansData
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Load Subscription Plans', errorMessage)
      throw err
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, showErrorToast])

  /**
   * Select a subscription plan
   */
  const selectPlan = useCallback((plan: SubscriptionPlan | null) => {
    dispatch(setSelectedPlan(plan))
  }, [dispatch])

  /**
   * Get plan by UUID
   */
  const getPlanByUuid = useCallback((uuid: string): SubscriptionPlan | undefined => {
    return plans.find(plan => plan.uuid === uuid)
  }, [plans])

  return {
    plans,
    selectedPlan,
    isLoading,
    error,
    loadPlans,
    selectPlan,
    getPlanByUuid,
  }
}

