import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Midora AI - Frontend',
  description: 'A modern Next.js application with AI capabilities',
  keywords: ['Next.js', 'React', 'TypeScript', 'AI', 'Frontend'],
  authors: [{ name: 'Midora AI Team' }],
  creator: 'Midora AI',
  publisher: 'Midora AI',
  robots: 'index, follow',
  openGraph: {
    title: 'Midora AI - Frontend',
    description: 'A modern Next.js application with AI capabilities',
    url: 'https://midora.ai',
    siteName: 'Midora AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Midora AI - Frontend',
    description: 'A modern Next.js application with AI capabilities',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
          {children}
        </div>
      </body>
    </html>
  )
}
