'use client'

import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@/hooks/use-theme'
import { LanguageProvider } from '@/hooks/use-language'
import { ThemeInitializer } from '@/components/ui/theme-initializer'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { AuthInitializer } from '@/components/auth/AuthInitializer'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastContainer } from '@/components/ui/toast'
import { WebSocketInitializer } from '@/components/providers/WebSocketInitializer'

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Wraps all client-side providers and defers rendering until after mount
 * to avoid SSR/CSR hydration mismatches around Suspense boundaries.
 * 
 * Provider hierarchy (order matters):
 * 1. LanguageProvider - Language/i18n support
 * 2. ThemeProvider - Theme management
 * 3. ThemeInitializer - Theme initialization
 * 4. ReduxProvider - Redux store
 * 5. AuthInitializer - Auth state restoration
 * 6. AuthProvider - Auth context
 * 7. WebSocketInitializer - WebSocket connection (depends on Auth)
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render a minimal, stable shell during SSR/initial hydration
  if (!mounted) {
    return <div className="min-h-screen app-bg-primary" />
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <ThemeInitializer />
        <ReduxProvider>
          <AuthInitializer />
          <AuthProvider>
            <WebSocketInitializer>
              <div className="min-h-screen app-bg-primary">
                {children}
                <ToastContainer />
              </div>
            </WebSocketInitializer>
          </AuthProvider>
        </ReduxProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}


