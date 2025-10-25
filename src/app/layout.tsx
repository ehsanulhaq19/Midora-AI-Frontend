import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { AuthInitializer } from '@/components/auth/AuthInitializer'
import { initializeI18n } from '@/i18n'
import { initializeInterceptors } from '@/api/interceptors'
import { ThemeInitializer } from '@/components/ui/theme-initializer'
import { ThemeProvider } from '@/hooks/use-theme'
import { ToastContainer } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Midora AI - Multi-Model AI Platform',
  description: 'Access OpenAI, Gemini, Claude, DeepSeek and more AI models in one platform. Plus AI detection, plagiarism checking, and market intelligence tools.',
  keywords: ['AI Platform', 'OpenAI', 'Gemini', 'Claude', 'DeepSeek', 'AI Detection', 'Plagiarism Checker', 'Market Tools', 'Stock Alerts'],
  authors: [{ name: 'Midora AI Team' }],
  creator: 'Midora AI',
  publisher: 'Midora AI',
  robots: 'index, follow',
  openGraph: {
    title: 'Midora AI - Multi-Model AI Platform',
    description: 'Access OpenAI, Gemini, Claude, DeepSeek and more AI models in one platform. Plus AI detection, plagiarism checking, and market intelligence tools.',
    url: 'https://midora.ai',
    siteName: 'Midora AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Midora AI - Multi-Model AI Platform',
    description: 'Access OpenAI, Gemini, Claude, DeepSeek and more AI models in one platform. Plus AI detection, plagiarism checking, and market intelligence tools.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#a855f7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize i18n and interceptors
  if (typeof window !== 'undefined') {
    initializeI18n()
    initializeInterceptors()
  }

  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  )
}
