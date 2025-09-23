import { useAppSelector } from '@/store/hooks'

/**
 * Custom hook to access authentication state from Redux store
 * This provides a clean interface for components to access auth data
 */
export const useAuthRedux = () => {
  const authState = useAppSelector((state) => state.auth)
  
  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    // Convenience getters
    userName: authState.user?.first_name || 'User',
    userEmail: authState.user?.email || '',
    userFullName: authState.user ? `${authState.user.first_name} ${authState.user.last_name}`.trim() : 'User',
  }
}

