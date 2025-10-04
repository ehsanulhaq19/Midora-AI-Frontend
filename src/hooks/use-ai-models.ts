/**
 * Hook to fetch and manage AI service providers and models
 */

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { aiApi } from '@/api/ai/api'
import {
  setServiceProviders,
  setSelectedProvider,
  setAutoMode,
  setSelectedModel,
  setError,
  clearError
} from '@/store/slices/aiModelsSlice'
import { AIServiceProvider, AIModel } from '@/api/ai/types'

interface UseAIModelsReturn {
  serviceProviders: AIServiceProvider[]
  selectedProvider: AIServiceProvider | null
  selectedProviderModels: AIModel[]
  selectedModel: AIModel | null
  isAutoMode: boolean
  isLoading: boolean
  error: string | null
  fetchServiceProviders: () => Promise<void>
  selectProvider: (provider: AIServiceProvider | null) => void
  selectModel: (model: AIModel | null) => void
  setAuto: (auto: boolean) => void
  clearError: () => void
}

export const useAIModels = (): UseAIModelsReturn => {
  const dispatch = useAppDispatch()
  
  const {
    serviceProviders,
    selectedProvider,
    selectedProviderModels,
    selectedModel,
    isAutoMode,
    isLoading,
    error
  } = useAppSelector((state) => state.aiModels)

  const fetchServiceProviders = useCallback(async () => {
    try {
      dispatch(clearError())
      dispatch({ type: 'aiModels/setLoading', payload: true })
      
      const response = await aiApi.getServiceProviders()
      
      if (response.success && response.data) {
        dispatch(setServiceProviders(response.data.providers))
      } else {
        throw new Error({
          error_type: 'API_ERROR',
          error_message: response.error_message || 'Failed to fetch service providers'
        } as any)
      }
    } catch (error: any) {
      const errorMessage = error?.error_message || error?.message || 'Failed to fetch AI service providers'
      dispatch(setError(errorMessage))
      console.error('Error fetching service providers:', error)
    } finally {
      dispatch({ type: 'aiModels/setLoading', payload: false })
    }
  }, [dispatch])

  const selectProvider = useCallback((provider: AIServiceProvider | null) => {
    dispatch(setSelectedProvider(provider))
  }, [dispatch])

  const selectModel = useCallback((model: AIModel | null) => {
    dispatch(setSelectedModel(model))
  }, [dispatch])

  const setAuto = useCallback((auto: boolean) => {
    dispatch(setAutoMode(auto))
  }, [dispatch])

  const clearErrorHandler = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    serviceProviders,
    selectedProvider,
    selectedProviderModels,
    selectedModel,
    isAutoMode,
    isLoading,
    error,
    fetchServiceProviders,
    selectProvider,
    selectModel,
    setAuto,
    clearError: clearErrorHandler
  }
}
