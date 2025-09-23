'use client'

import { useAuthInit } from '@/hooks/useAuthInit'

/**
 * Component to initialize authentication state on app startup
 * This should be placed high in the component tree
 */
export const AuthInitializer: React.FC = () => {
  useAuthInit()
  return null
}
