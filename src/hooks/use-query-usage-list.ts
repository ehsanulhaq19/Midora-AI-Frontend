/**
 * Hook for fetching user query usage list
 */

import { useState, useEffect, useCallback } from 'react'
import { userUsageApi } from '@/api/user-usage/api'
import { QueryUsageListItem } from '@/api/user-usage/types'

interface UseQueryUsageListReturn {
  data: QueryUsageListItem[] | null
  loading: boolean
  error: {
    error_message?: string
    backend_error?: any
  } | null
  refetch: () => Promise<void>
}

interface UseQueryUsageListParams {
  startTime: string
  endTime: string
  enabled?: boolean
}

export const useQueryUsageList = (
  params: UseQueryUsageListParams
): UseQueryUsageListReturn => {
  const [data, setData] = useState<QueryUsageListItem[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<{
    error_message?: string
    backend_error?: any
  } | null>(null)

  const fetchData = useCallback(async () => {
    if (!params.enabled) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await userUsageApi.getQueryUsageList(
        params.startTime,
        params.endTime
      )

      if (response.error || !response.success) {
        setError({
          error_message: response.error || 'Failed to fetch query usage list',
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
  }, [params.startTime, params.endTime, params.enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

