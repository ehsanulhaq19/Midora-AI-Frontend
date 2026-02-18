# AI Service Providers Implementation

## Overview

This document describes the implementation of AI service providers and model selection functionality in the Midora AI frontend application. The implementation allows users to select from different AI service providers (OpenAI, Gemini, Claude, DeepSeek) and their specific models, with an "Auto" mode for automatic model selection.

## Features

### 1. Service Provider Selection
- **Auto Mode**: Automatically selects the best available model
- **Manual Mode**: Allows users to select specific service providers
- **Provider Icons**: Each provider displays with its respective logo/image

### 2. Model Selection
- **Dynamic Model List**: Shows available models for the selected provider
- **Default Model Selection**: Automatically selects the default model for each provider
- **Model Information**: Displays model names and capabilities

### 3. API Integration
- **Service Providers Endpoint**: `/api/v1/ai-service-providers/with-active-models`
- **Model UUID in Requests**: Includes selected model UUID in AI generation requests
- **Streaming Support**: Maintains streaming functionality with model selection

## Implementation Details

### 1. API Types (`src/api/ai/types.ts`)

```typescript
// AI Model interface
export interface AIModel {
  uuid: string
  encoded_uuid: string
  model_name: string
  capability: string
  input_cost_per_million: string
  output_cost_per_million: string
  provider: string
  api_model_name: string
  image_path: string
  is_fallback_model: boolean
  is_default_model: boolean
  is_active: boolean
  created_at: string
  updated_at: string | null
}

// AI Service Provider interface
export interface AIServiceProvider {
  uuid: string
  encoded_uuid: string
  name: string
  api_key: string
  created_at: string
  updated_at: string | null
  active_models: AIModel[]
  active_models_count: number
}
```

### 2. API Client (`src/api/ai/api.ts`)

Added new method to fetch service providers:

```typescript
async getServiceProviders(): Promise<ApiResponse<AIServiceProvidersResponse>> {
  return this.baseClient.get<AIServiceProvidersResponse>('/api/v1/ai-service-providers/with-active-models')
}
```

### 3. Redux State Management

#### Separate AI Models Slice (`src/store/slices/aiModelsSlice.ts`)

Created a dedicated slice for AI models and service providers:

```typescript
interface AIModelsState {
  serviceProviders: AIServiceProvider[]
  selectedProvider: AIServiceProvider | null
  selectedProviderModels: AIModel[]
  selectedModel: AIModel | null
  isAutoMode: boolean
  isLoading: boolean
  error: string | null
}
```

Actions:
- `setServiceProviders`: Set available service providers
- `setSelectedProvider`: Select a provider and auto-select its default model
- `setAutoMode`: Enable/disable auto mode
- `setSelectedModel`: Select a specific model
- `setLoading`: Set loading state
- `setError`/`clearError`: Error handling
- `resetAIModels`: Reset all state

#### Store Configuration (`src/store/index.ts`)

Added the new slice to the store:

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    aiModels: aiModelsReducer, // New slice
    toast: toastReducer,
  },
})
```

### 4. Custom Hook (`src/hooks/use-ai-models.ts`)

Provides a clean interface for managing AI models using the separate slice:

```typescript
export const useAIModels = (): UseAIModelsReturn => {
  // Uses state.aiModels instead of state.conversation
  const state = useAppSelector((state) => state.aiModels)
  
  // Returns:
  // - serviceProviders: Available providers
  // - selectedProvider: Currently selected provider
  // - selectedProviderModels: Models for selected provider
  // - selectedModel: Currently selected model
  // - isAutoMode: Whether auto mode is enabled
  // - isLoading: Loading state
  // - error: Error state
  // - fetchServiceProviders: Function to load providers
  // - selectProvider: Function to select provider
  // - selectModel: Function to select model
  // - setAuto: Function to toggle auto mode
  // - clearError: Function to clear errors
}
```

### 5. UI Components

#### Dropdown Component (`src/components/ui/dropdown/`)

Reusable dropdown component with:
- Custom styling matching the theme
- Support for icons and images
- Keyboard navigation
- Click outside to close

#### Model Selection Component (`src/components/chat/sections/model-selection.tsx`)

Updated to:
- Fetch and display service providers
- Show provider images from first model
- Handle Auto/Manual mode switching
- Integrate with Redux state

#### Message Input Component (`src/components/chat/sections/message-input.tsx`)

Enhanced with:
- Models dropdown (hidden in auto mode)
- Model selection functionality
- Pass model UUID to send function

### 6. User Flow

1. **Initial Load**: Fetch service providers on chat screen load using `fetchServiceProviders()` from `useAIModels` hook
2. **Provider Selection**: User selects provider from dropdown
3. **Model Selection**: Default model auto-selected, user can change via models dropdown
4. **Auto Mode**: Hide models dropdown, no model UUID sent in requests
5. **Message Sending**: Include selected model UUID in API requests

### 7. Integration Points

#### Chat Screen Integration (`src/components/chat/chat-screen.tsx`)
```typescript
import { useAIModels } from '@/hooks'

export const ChatScreen: React.FC = () => {
  const { fetchServiceProviders } = useAIModels()
  
  useEffect(() => {
    // Load initial data
    loadConversations()
    fetchServiceProviders() // Uses new AI models hook
  }, [loadConversations, fetchServiceProviders])
}
```

## API Response Structure

The service providers endpoint returns:

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "uuid": "provider-uuid",
        "name": "OpenAI",
        "active_models": [
          {
            "uuid": "model-uuid",
            "model_name": "GPT-4o",
            "capability": "Most capable OpenAI general model",
            "is_default_model": true,
            "image_path": "/images/providers/openai.png"
          }
        ]
      }
    ],
    "count": 4,
    "message": "Service providers with active models retrieved successfully"
  }
}
```

## Error Handling

- API errors are caught and displayed via toast notifications
- Loading states are managed for better UX
- Fallback to auto mode on errors
- Graceful degradation when providers fail to load

## Internationalization

Added translations in `src/i18n/languages/en/chat.ts`:

```typescript
// AI Model Selection
auto: 'Auto',
selectProvider: 'Select Provider',
selectModel: 'Select Model',
aiModels: 'AI Models',
serviceProviders: 'Service Providers',
defaultModel: 'Default Model',
```

## Testing Considerations

- Mock the service providers API for testing
- Test provider selection flow
- Test model selection and default behavior
- Test auto mode functionality
- Test error handling scenarios

## Future Enhancements

1. **Model Comparison**: Show model capabilities and pricing
2. **Favorites**: Allow users to mark favorite models
3. **Usage Analytics**: Track model usage statistics
4. **Performance Metrics**: Display response times per model
5. **Advanced Filtering**: Filter models by capability or cost

## Dependencies

- Redux Toolkit for state management
- React hooks for component logic
- Tailwind CSS for styling
- Next.js Image component for optimized images
- Custom UI components for consistency

## File Structure

```
src/
├── api/ai/
│   ├── api.ts (updated)
│   └── types.ts (updated)
├── components/
│   ├── ui/dropdown/ (new)
│   └── chat/sections/
│       ├── model-selection.tsx (updated)
│       └── message-input.tsx (updated)
├── hooks/
│   └── use-ai-models.ts (updated)
├── store/
│   ├── index.ts (updated)
│   └── slices/
│       ├── aiModelsSlice.ts (new)
│       └── conversationSlice.ts (updated)
└── types/
    ├── ai-models.ts (new)
    ├── conversation.ts (updated)
    └── index.ts (updated)
```

## Configuration

No additional configuration required. The implementation uses existing:
- API base configuration
- Redux store setup
- Theme system
- Internationalization setup
