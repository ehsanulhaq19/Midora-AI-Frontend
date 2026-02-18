import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AIServiceProvider, AIModel } from '@/api/ai/types'
import { AIModelsState } from '@/types/ai-models'

const initialState: AIModelsState = {
  serviceProviders: [],
  selectedProvider: null,
  selectedProviderModels: [],
  selectedModel: null,
  isAutoMode: true, // Set auto mode as default
  isLoading: false,
  error: null,
}

const aiModelsSlice = createSlice({
  name: 'aiModels',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Clear error state
    clearError: (state) => {
      state.error = null
    },

    // Set service providers
    setServiceProviders: (state, action: PayloadAction<AIServiceProvider[]>) => {
      state.serviceProviders = action.payload
    },

    // Set selected provider
    setSelectedProvider: (state, action: PayloadAction<AIServiceProvider | null>) => {
      state.selectedProvider = action.payload
      if (action.payload) {
        state.selectedProviderModels = action.payload.active_models
        // Auto-select the default model of the selected provider
        const defaultModel = action.payload.active_models.find(model => model.is_default_model)
        state.selectedModel = defaultModel || action.payload.active_models[0] || null
        state.isAutoMode = false
      } else {
        state.selectedProviderModels = []
        state.selectedModel = null
      }
    },

    // Set auto mode
    setAutoMode: (state, action: PayloadAction<boolean>) => {
      state.isAutoMode = action.payload
      if (action.payload) {
        state.selectedProvider = null
        state.selectedProviderModels = []
        state.selectedModel = null
      }
    },

    // Set selected model
    setSelectedModel: (state, action: PayloadAction<AIModel | null>) => {
      state.selectedModel = action.payload
    },

    // Reset AI models state
    resetAIModels: (state) => {
      state.serviceProviders = []
      state.selectedProvider = null
      state.selectedProviderModels = []
      state.selectedModel = null
      state.isAutoMode = false
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setServiceProviders,
  setSelectedProvider,
  setAutoMode,
  setSelectedModel,
  resetAIModels,
} = aiModelsSlice.actions

export default aiModelsSlice.reducer
