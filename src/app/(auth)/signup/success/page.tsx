'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { t } from '@/i18n'
import { PageTransition } from '@/components/ui/page-transition'

export default function SignupSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <PageTransition>
      <div className="relative min-h-screen w-full bg-[color:var(--tokens-color-surface-surface-primary)]">
        {/* Header with Logo */}
        <header className="absolute top-[37px] left-[44px] w-auto">
          <div className="max-w-7xl mx-auto ml-0">
            <div className="flex justify-start">
              <a 
                href="/" 
                className="flex flex-col w-[120px] sm:w-[140px] lg:w-[154px] items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  className="relative self-stretch w-full aspect-[5.19] object-cover"
                  alt="Midora AI Logo"
                  src="/img/logo.png"
                />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[408px]">
            <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    className="w-10 h-10 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                
                <h1 className="relative w-full max-w-[400px] mt-[-1.00px] font-heading-primary font-normal text-[color:var(--tokens-color-text-text-seconary)] text-3xl sm:text-4xl tracking-[-1.80px] leading-9">
                  <span className="font-light tracking-[-0.65px]">
                    Welcome to Midora AI!
                  </span>
                </h1>
                
                <p className="relative w-full max-w-[350px] font-body-primary font-normal text-[#a0a0a0] text-base tracking-[-0.48px] leading-6">
                  Your account has been created successfully. You'll be redirected to your dashboard in {countdown} seconds.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] bg-[color:var(--tokens-color-surface-surface-primary)] rounded-3xl shadow-[-6px_4px_33.2px_#4d30711a]">
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 h-[54px] items-center justify-center rounded-xl bg-tokens-color-surface-surface-button-pressed hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="font-body-primary font-normal text-white text-base tracking-[-0.48px] leading-[normal]">
                      Go to Dashboard
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
