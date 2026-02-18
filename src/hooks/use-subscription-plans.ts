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
  setActiveSubscription,
  setSubscriptionLoading,
} from '@/store/slices/subscription-plans-slice'
import { useToast } from './use-toast'
import { handleApiError } from '@/lib/error-handler'

export const useSubscriptionPlans = () => {
  const dispatch = useDispatch()
  const { error: showErrorToast } = useToast()
  const {
    plans,
    selectedPlan,
    activeSubscription,
    isLoading,
    isSubscriptionLoading,
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

  /**
   * Load active subscription
   */
  const loadActiveSubscription = useCallback(async () => {
    try {
      dispatch(setSubscriptionLoading(true))
      dispatch(clearError())

      const response = await subscriptionPlansApi.getActiveSubscription()

      if (response.error) {
        // Check for SUBSCRIPTION_NOT_FOUND error type or 404 status
        // This is not an error - it just means the user doesn't have a subscription
        const errorType = response.processedError?.error_type || response.error_type
        if (response.status === 404 || errorType === 'SUBSCRIPTION_NOT_FOUND') {
          dispatch(setActiveSubscription(null))
          return null
        }
        
        // For other errors, throw and show error toast
        const errorObject = response.processedError || {
          error_type: 'SUBSCRIPTION_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        dispatch(setError(response.error))
        throw new Error(JSON.stringify(errorObject))
      }

      const subscriptionData = response.data
      dispatch(setActiveSubscription(subscriptionData))
      return subscriptionData
    } catch (err) {
      const errorMessage = handleApiError(err)
      // Check if this is a "not found" error (subscription doesn't exist)
      if (errorMessage.includes('404') || 
          errorMessage.includes('not found') || 
          errorMessage.includes('SUBSCRIPTION_NOT_FOUND')) {
        dispatch(setActiveSubscription(null))
        return null
      }
      // Only show error toast for actual errors, not "not found"
      showErrorToast('Failed to Load Subscription', errorMessage)
      throw err
    } finally {
      dispatch(setSubscriptionLoading(false))
    }
  }, [dispatch, showErrorToast])

  /**
   * Cancel subscription
   */
  const cancelSubscription = useCallback(async (subscriptionUuid: string) => {
    try {
      dispatch(setSubscriptionLoading(true))
      dispatch(clearError())

      const response = await subscriptionPlansApi.cancelSubscription(subscriptionUuid)

      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'SUBSCRIPTION_CANCEL_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        dispatch(setError(response.error))
        throw new Error(JSON.stringify(errorObject))
      }

      dispatch(setActiveSubscription(null))
      return response.data
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Cancel Subscription', errorMessage)
      throw err
    } finally {
      dispatch(setSubscriptionLoading(false))
    }
  }, [dispatch, showErrorToast])

  return {
    plans,
    selectedPlan,
    activeSubscription,
    isLoading,
    isSubscriptionLoading,
    error,
    loadPlans,
    selectPlan,
    getPlanByUuid,
    loadActiveSubscription,
    cancelSubscription,
  }
}

