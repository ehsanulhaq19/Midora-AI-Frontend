import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Midora AI',
  description: 'Sign in or create your Midora AI account to access AI-powered tools and insights.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


