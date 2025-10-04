import { useState, useCallback, useEffect } from 'react'

interface UsePageLoadingOptions {
  /** Initial loading state */
  initialLoading?: boolean
  /** Minimum loading time in milliseconds */
  minLoadingTime?: number
  /** Initial loading message */
  initialMessage?: string
}

interface UsePageLoadingReturn {
  isLoading: boolean
  loadingMessage: string
  setLoading: (loading: boolean, message?: string) => void
  showLoading: (message?: string) => void
  hideLoading: () => void
  updateMessage: (message: string) => void
}

/**
 * Hook for managing page loading states
 * Provides smooth loading experience with minimum loading time
 */
export const usePageLoading = (options: UsePageLoadingOptions = {}): UsePageLoadingReturn => {
  const {
    initialLoading = false,
    minLoadingTime = 500,
    initialMessage = 'Loading...'
  } = options

  const [isLoading, setIsLoading] = useState(initialLoading)
  const [loadingMessage, setLoadingMessage] = useState(initialMessage)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  const setLoading = useCallback((loading: boolean, message?: string) => {
    if (loading) {
      setIsLoading(true)
      setLoadingStartTime(Date.now())
      if (message) {
        setLoadingMessage(message)
      }
    } else {
      const elapsed = loadingStartTime ? Date.now() - loadingStartTime : 0
      const remainingTime = Math.max(0, minLoadingTime - elapsed)
      
      setTimeout(() => {
        setIsLoading(false)
        setLoadingStartTime(null)
      }, remainingTime)
    }
  }, [loadingStartTime, minLoadingTime])

  const showLoading = useCallback((message?: string) => {
    setLoading(true, message)
  }, [setLoading])

  const hideLoading = useCallback(() => {
    setLoading(false)
  }, [setLoading])

  const updateMessage = useCallback((message: string) => {
    setLoadingMessage(message)
  }, [])

  return {
    isLoading,
    loadingMessage,
    setLoading,
    showLoading,
    hideLoading,
    updateMessage
  }
}

export default usePageLoading
