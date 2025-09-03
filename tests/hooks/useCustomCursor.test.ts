/**
 * Tests for useCustomCursor hook
 */

import { renderHook, act } from '@testing-library/react'
import { useCustomCursor } from '@/hooks/useCustomCursor'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useCustomCursor', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  it('should initialize with theme default value when no localStorage preference', () => {
    const { result } = renderHook(() => useCustomCursor())
    
    expect(result.current.isEnabled).toBe(true) // theme default
  })

  it('should load preference from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('false')
    
    const { result } = renderHook(() => useCustomCursor())
    
    expect(result.current.isEnabled).toBe(false)
    expect(localStorageMock.getItem).toHaveBeenCalledWith('midora-custom-cursor-enabled')
  })

  it('should enable cursor when enable function is called', () => {
    const { result } = renderHook(() => useCustomCursor())
    
    act(() => {
      result.current.enable()
    })
    
    expect(result.current.isEnabled).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('midora-custom-cursor-enabled', 'true')
  })

  it('should disable cursor when disable function is called', () => {
    const { result } = renderHook(() => useCustomCursor())
    
    act(() => {
      result.current.disable()
    })
    
    expect(result.current.isEnabled).toBe(false)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('midora-custom-cursor-enabled', 'false')
  })

  it('should toggle cursor state when toggle function is called', () => {
    const { result } = renderHook(() => useCustomCursor())
    
    // Start with enabled (theme default)
    expect(result.current.isEnabled).toBe(true)
    
    // Toggle to disabled
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isEnabled).toBe(false)
    
    // Toggle back to enabled
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isEnabled).toBe(true)
  })

  it('should save preference to localStorage when state changes', () => {
    const { result } = renderHook(() => useCustomCursor())
    
    act(() => {
      result.current.disable()
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('midora-custom-cursor-enabled', 'false')
    
    act(() => {
      result.current.enable()
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('midora-custom-cursor-enabled', 'true')
  })

  it('should handle invalid localStorage values gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useCustomCursor())
    
    // Should fall back to theme default
    expect(result.current.isEnabled).toBe(true)
  })

  it('should handle null localStorage values gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useCustomCursor())
    
    // Should fall back to theme default
    expect(result.current.isEnabled).toBe(true)
  })
})
