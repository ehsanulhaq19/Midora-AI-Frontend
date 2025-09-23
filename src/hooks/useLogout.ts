/**
 * Custom hook for logout functionality
 * Handles clearing Redux store and calling backend logout API
 */

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { authApi } from '@/api/auth/api'
import { logout, setLoading, setError } from '@/store/slices/authSlice'
import { handleApiError } from '@/lib/error-handler'
import { clearAuthCookies } from '@/lib/auth'

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  /**
   * Logout user and clear all auth data
   */
  const logoutUser = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      // Call backend logout API to invalidate tokens
      try {
        await authApi.logout()
      } catch (error) {
        // Even if backend logout fails, we should still clear local state
        console.warn('Backend logout failed:', error)
      }

      // Clear Redux store
      dispatch(logout())

      // Clear all authentication cookies
      clearAuthCookies()

      // Redirect to signup page
      router.push('/signup')
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
    }
  }, [dispatch, router])

  return {
    logoutUser
  }
}
