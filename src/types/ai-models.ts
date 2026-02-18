// AI Models related types
export type { AIServiceProvider, AIModel } from '@/api/ai/types'

export interface AIModelsState {
  serviceProviders: AIServiceProvider[]
  selectedProvider: AIServiceProvider | null
  selectedProviderModels: AIModel[]
  selectedModel: AIModel | null
  isAutoMode: boolean
  isLoading: boolean
  error: string | null
}
