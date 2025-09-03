'use client'

import { Header } from '@/components/ui/Header'
import { SimpleHome } from '@/components/ui/SimpleHome'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <SimpleHome />
    </main>
  )
}
