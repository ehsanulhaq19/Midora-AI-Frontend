import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UseScreenLoaderOptions {
  /** Minimum loading time in milliseconds to prevent flash */
  minLoadingTime?: number
  /** Initial loading message */
  initialMessage?: string
  /** Whether to show loading on route changes */
  showOnRouteChange?: boolean
}

interface UseScreenLoaderReturn {
  isLoading: boolean
  loadingMessage: string
  setLoading: (loading: boolean, message?: string) => void
  showLoader: (message?: string) => void
  hideLoader: () => void
  updateMessage: (message: string) => void
}

/**
 * Hook for managing screen loading states
 * Provides a consistent loading experience across the application
 */
export const useScreenLoader = (options: UseScreenLoaderOptions = {}): UseScreenLoaderReturn => {
  const {
    minLoadingTime = 500,
    initialMessage = 'Loading...',
    showOnRouteChange = true
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(initialMessage)
  const [startTime, setStartTime] = useState<number | null>(null)
  const router = useRouter()

  const setLoading = useCallback((loading: boolean, message?: string) => {
    if (loading) {
      setIsLoading(true)
      setStartTime(Date.now())
      if (message) {
        setLoadingMessage(message)
      }
    } else {
      const elapsed = startTime ? Date.now() - startTime : 0
      const remainingTime = Math.max(0, minLoadingTime - elapsed)
      
      setTimeout(() => {
        setIsLoading(false)
        setStartTime(null)
      }, remainingTime)
    }
  }, [startTime, minLoadingTime])

  const showLoader = useCallback((message?: string) => {
    setLoading(true, message)
  }, [setLoading])

  const hideLoader = useCallback(() => {
    setLoading(false)
  }, [setLoading])

  const updateMessage = useCallback((message: string) => {
    setLoadingMessage(message)
  }, [])

  // Handle route change loading
  useEffect(() => {
    if (!showOnRouteChange) return

    const handleRouteChangeStart = () => {
      showLoader('Loading page...')
    }

    const handleRouteChangeComplete = () => {
      hideLoader()
    }

    // Note: Next.js 13+ App Router doesn't have router events like Pages Router
    // For App Router, we'll need to handle loading states manually in components
    // This is a placeholder for future router event integration

    return () => {
      // Cleanup if needed
    }
  }, [showOnRouteChange, showLoader, hideLoader])

  return {
    isLoading,
    loadingMessage,
    setLoading,
    showLoader,
    hideLoader,
    updateMessage
  }
}

export default useScreenLoader
