/**
 * Custom hook for SSO authentication
 * Handles Google, Microsoft, and GitHub OAuth flows
 */

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { authApi } from '@/api/auth/api'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { handleApiError } from '@/lib/error-handler'
import { tokenManager } from '@/lib/token-manager'
import { setTokens } from '@/lib/auth'
import { t } from '@/i18n'

export const useSSO = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  /**
   * Initiate SSO authentication flow
   */
  const initiateSSO = useCallback(async (provider: 'google' | 'microsoft' | 'github') => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      // Generate a random state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      
      // Store state in sessionStorage for verification
      sessionStorage.setItem('sso_state', state)

      let response
      switch (provider) {
        case 'google':
          response = await authApi.getGoogleAuthUrl(state)
          break
        case 'microsoft':
          response = await authApi.getMicrosoftAuthUrl(state)
          break
        case 'github':
          response = await authApi.getGitHubAuthUrl(state)
          break
        default:
          throw new Error('Unsupported SSO provider')
      }

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data?.auth_url) {
        // Redirect to the OAuth provider
        window.location.href = response.data.auth_url
      } else {
        throw new Error('Failed to get authorization URL')
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
    }
  }, [dispatch])

  /**
   * Handle SSO callback
   */
  const handleSSOCallback = useCallback(async (
    provider: 'google' | 'microsoft' | 'github',
    code: string,
    state?: string
  ) => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      // Verify state parameter for CSRF protection
      const storedState = sessionStorage.getItem('sso_state')
      if (state && storedState && state !== storedState) {
        throw new Error('Invalid state parameter')
      }

      let response
      switch (provider) {
        case 'google':
          response = await authApi.handleGoogleCallback(code, state)
          break
        case 'microsoft':
          response = await authApi.handleMicrosoftCallback(code, state)
          break
        case 'github':
          response = await authApi.handleGitHubCallback(code, state)
          break
        default:
          throw new Error('Unsupported SSO provider')
      }

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        // Store auth data in Redux
        dispatch(loginSuccess({
          user: response.data.user,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          authMethod: provider
        }))

        // Store tokens using token manager
        tokenManager.storeTokens(
          response.data.access_token,
          response.data.refresh_token,
          provider
        )
        
        // Also store in cookies for middleware access
        setTokens(response.data.access_token, response.data.refresh_token)

        // Clear the state from sessionStorage
        sessionStorage.removeItem('sso_state')

        // Redirect to chat page
        router.push('/chat')
      } else {
        throw new Error('Invalid response from SSO provider')
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      dispatch(setError(errorMessage))
      dispatch(setLoading(false))
      
      // Redirect to signup page on error
      router.push('/signup')
    }
  }, [dispatch, router])

  /**
   * Handle Google SSO
   */
  const signInWithGoogle = useCallback(() => {
    initiateSSO('google')
  }, [initiateSSO])

  /**
   * Handle Microsoft SSO
   */
  const signInWithMicrosoft = useCallback(() => {
    initiateSSO('microsoft')
  }, [initiateSSO])

  /**
   * Handle GitHub SSO
   */
  const signInWithGitHub = useCallback(() => {
    initiateSSO('github')
  }, [initiateSSO])

  return {
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithGitHub,
    handleSSOCallback,
    initiateSSO
  }
}
