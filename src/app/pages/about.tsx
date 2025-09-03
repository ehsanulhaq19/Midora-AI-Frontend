'use client'

import { Header } from '@/components/ui/Header'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="min-h-screen bg-primary-950 flex items-center justify-center pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About Midora
          </h1>
          <p className="text-xl text-primary-100 leading-relaxed max-w-3xl mx-auto">
            Midora is a cutting-edge AI platform that brings together multiple AI models and powerful tools in one unified interface.
          </p>
        </div>
      </section>
    </main>
  )
}
