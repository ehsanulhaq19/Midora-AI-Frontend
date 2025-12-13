/**
 * Hook for fetching user credits and subscription information
 */

import { useState, useEffect } from 'react'
import { userUsageApi } from '@/api/user-usage/api'
import { UserCreditsAndSubscriptionInfo } from '@/api/user-usage/types'

interface UseUserCreditsReturn {
  data: UserCreditsAndSubscriptionInfo | null
  loading: boolean
  error: {
    error_message?: string
    backend_error?: any
  } | null
  refetch: () => Promise<void>
}

export const useUserCredits = (): UseUserCreditsReturn => {
  const [data, setData] = useState<UserCreditsAndSubscriptionInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<{
    error_message?: string
    backend_error?: any
  } | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await userUsageApi.getCreditsAndSubscriptionInfo()

      if (response.error || !response.success) {
        setError({
          error_message: response.error || 'Failed to fetch user credits',
          backend_error: response.processedError,
        })
        setData(null)
      } else {
        setData(response.data || null)
        setError(null)
      }
    } catch (err: any) {
      setError({
        error_message: err.message || 'An unexpected error occurred',
        backend_error: err,
      })
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

