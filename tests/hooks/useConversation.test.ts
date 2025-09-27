import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useConversation } from '@/hooks/useConversation'
import conversationReducer from '@/store/slices/conversationSlice'
import authReducer from '@/store/slices/authSlice'
import { conversationApi } from '@/api/conversation/api'

// Mock the API
jest.mock('@/api/conversation/api', () => ({
  conversationApi: {
    getConversations: jest.fn(),
    createConversation: jest.fn(),
    getConversation: jest.fn(),
    getMessages: jest.fn(),
    generateContentStream: jest.fn(),
    getAIModels: jest.fn(),
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
global.fetch = jest.fn()

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      conversation: conversationReducer,
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User' },
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authMethod: 'email',
      },
      conversation: {
        conversations: [],
        currentConversation: null,
        messages: {},
        isLoading: false,
        error: null,
        isStreaming: false,
        streamingContent: '',
        aiModels: [],
        selectedModel: null,
        ...initialState,
      },
    },
  })
}

const wrapper = ({ children, store }: { children: React.ReactNode; store: any }) => (
  <Provider store={store}>{children}</Provider>
)

describe('useConversation', () => {
  let store: any

  beforeEach(() => {
    store = createMockStore()
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('mock-token')
  })

  it('should load conversations successfully', async () => {
    const mockConversations = [
      {
        id: '1',
        uuid: 'conv-1',
        name: 'Test Conversation',
        created_by: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }
    ]

    ;(conversationApi.getConversations as jest.Mock).mockResolvedValue({
      success: true,
      data: mockConversations,
    })

    const { result } = renderHook(() => useConversation(), {
      wrapper: ({ children }) => wrapper({ children, store }),
    })

    await act(async () => {
      await result.current.loadConversations()
    })

    expect(conversationApi.getConversations).toHaveBeenCalledWith(1, 20)
    expect(result.current.conversations).toEqual(mockConversations)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle conversation loading error', async () => {
    const errorMessage = 'Failed to load conversations'
    ;(conversationApi.getConversations as jest.Mock).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useConversation(), {
      wrapper: ({ children }) => wrapper({ children, store }),
    })

    await act(async () => {
      await result.current.loadConversations()
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.isLoading).toBe(false)
  })

  it('should create conversation successfully', async () => {
    const mockConversation = {
      id: '1',
      uuid: 'conv-1',
      name: 'New Conversation',
      created_by: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    ;(conversationApi.createConversation as jest.Mock).mockResolvedValue({
      success: true,
      data: mockConversation,
    })

    const { result } = renderHook(() => useConversation(), {
      wrapper: ({ children }) => wrapper({ children, store }),
    })

    let createdConversation: any
    await act(async () => {
      createdConversation = await result.current.createConversation('New Conversation')
    })

    expect(conversationApi.createConversation).toHaveBeenCalledWith({ name: 'New Conversation' })
    expect(createdConversation).toEqual(mockConversation)
    expect(result.current.conversations).toContain(mockConversation)
    expect(result.current.currentConversation).toEqual(mockConversation)
  })

  it('should send message and create conversation if none exists', async () => {
    const mockConversation = {
      id: '1',
      uuid: 'conv-1',
      name: 'Chat - Test message...',
      created_by: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    ;(conversationApi.createConversation as jest.Mock).mockResolvedValue({
      success: true,
      data: mockConversation,
    })

    ;(conversationApi.generateContentStream as jest.Mock).mockImplementation(
      (data, onChunk, onComplete, onError) => {
        // Simulate streaming
        setTimeout(() => onChunk('Hello'), 10)
        setTimeout(() => onChunk(' world'), 20)
        setTimeout(() => onComplete({ ai_message_id: 'ai-1' }), 30)
        return Promise.resolve()
      }
    )

    const { result } = renderHook(() => useConversation(), {
      wrapper: ({ children }) => wrapper({ children, store }),
    })

    await act(async () => {
      await result.current.sendMessage('Test message')
    })

    expect(conversationApi.createConversation).toHaveBeenCalledWith({
      name: 'Chat - Test message...',
    })
    expect(conversationApi.generateContentStream).toHaveBeenCalled()
    expect(result.current.currentConversation).toEqual(mockConversation)
  })

  it('should load AI models successfully', async () => {
    const mockModels = [
      {
        model_name: 'GPT-4o',
        technical_name: 'gpt-4o',
        provider_name: 'OpenAI',
        image_path: '/images/providers/openai.png',
        capability: 'Most capable OpenAI general model',
        input_cost_per_million: 5.00,
        output_cost_per_million: 15.00,
        generation_category: ['text'],
      }
    ]

    ;(conversationApi.getAIModels as jest.Mock).mockResolvedValue({
      success: true,
      data: mockModels,
    })

    const { result } = renderHook(() => useConversation(), {
      wrapper: ({ children }) => wrapper({ children, store }),
    })

    await act(async () => {
      await result.current.loadAIModels()
    })

    expect(conversationApi.getAIModels).toHaveBeenCalled()
    expect(result.current.aiModels).toEqual(mockModels)
  })

  it('should start new chat', () => {
    const storeWithConversation = createMockStore({
      currentConversation: {
        id: '1',
        uuid: 'conv-1',
        name: 'Test Conversation',
        created_by: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    })

    const { result } = renderHook(() => useConversation(), {
      wrapper: ({ children }) => wrapper({ children, store: storeWithConversation }),
    })

    act(() => {
      result.current.startNewChat()
    })

    expect(result.current.currentConversation).toBeNull()
  })

  it('should clear error', () => {
    const storeWithError = createMockStore({
      error: 'Some error message',
    })

    const { result } = renderHook(() => useConversation(), {
      wrapper: ({ children }) => wrapper({ children, store: storeWithError }),
    })

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })
})
