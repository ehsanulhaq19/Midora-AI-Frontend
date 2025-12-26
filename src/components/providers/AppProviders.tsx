'use client'

import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@/hooks/use-theme'
import { LanguageProvider } from '@/hooks/use-language'
import { ThemeInitializer } from '@/components/ui/theme-initializer'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { AuthInitializer } from '@/components/auth/AuthInitializer'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastContainer } from '@/components/ui/toast'

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Wraps all client-side providers and defers rendering until after mount
 * to avoid SSR/CSR hydration mismatches around Suspense boundaries.
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
            <div className="min-h-screen app-bg-primary">
              {children}
              <ToastContainer />
            </div>
          </AuthProvider>
        </ReduxProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}


