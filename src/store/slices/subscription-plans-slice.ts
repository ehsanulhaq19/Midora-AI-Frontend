import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SubscriptionPlan, ActiveSubscription } from '@/api/subscription-plans/types'

export interface SubscriptionPlansState {
  plans: SubscriptionPlan[]
  selectedPlan: SubscriptionPlan | null
  activeSubscription: ActiveSubscription | null
  isLoading: boolean
  isSubscriptionLoading: boolean
  error: string | null
}

const initialState: SubscriptionPlansState = {
  plans: [],
  selectedPlan: null,
  activeSubscription: null,
  isLoading: false,
  isSubscriptionLoading: false,
  error: null,
}

const subscriptionPlansSlice = createSlice({
  name: 'subscriptionPlans',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<SubscriptionPlan[]>) => {
      state.plans = action.payload
      state.error = null
    },
    setSelectedPlan: (state, action: PayloadAction<SubscriptionPlan | null>) => {
      state.selectedPlan = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setActiveSubscription: (state, action: PayloadAction<ActiveSubscription | null>) => {
      state.activeSubscription = action.payload
    },
    setSubscriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionLoading = action.payload
    },
  },
})

export const {
  setPlans,
  setSelectedPlan,
  setLoading,
  setError,
  clearError,
  setActiveSubscription,
  setSubscriptionLoading,
} = subscriptionPlansSlice.actions

export default subscriptionPlansSlice.reducer

