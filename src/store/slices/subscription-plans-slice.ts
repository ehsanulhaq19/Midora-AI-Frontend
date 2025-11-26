import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SubscriptionPlan } from '@/api/subscription-plans/types'

export interface SubscriptionPlansState {
  plans: SubscriptionPlan[]
  selectedPlan: SubscriptionPlan | null
  isLoading: boolean
  error: string | null
}

const initialState: SubscriptionPlansState = {
  plans: [],
  selectedPlan: null,
  isLoading: false,
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
  },
})

export const {
  setPlans,
  setSelectedPlan,
  setLoading,
  setError,
  clearError,
} = subscriptionPlansSlice.actions

export default subscriptionPlansSlice.reducer

