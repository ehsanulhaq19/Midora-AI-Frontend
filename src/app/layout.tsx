import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { AppProviders } from '@/components/providers/AppProviders'

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('midora-theme');
                  const getSystemTheme = () => {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  };
                  const getResolvedTheme = (t) => {
                    if (t === 'system' || !t) return getSystemTheme();
                    return t;
                  };
                  const resolvedTheme = getResolvedTheme(theme);
                  const root = document.documentElement;
                  if (resolvedTheme === 'dark') {
                    root.setAttribute('data-theme', 'dark');
                  } else {
                    root.removeAttribute('data-theme');
                  }
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
