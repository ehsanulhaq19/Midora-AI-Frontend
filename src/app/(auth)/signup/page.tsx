'use client'

import React from 'react'
import { 
  HeroSection, 
  SignupFormSection, 
  PricingSection, 
  FaqSection, 
  FooterSection,
  GroupWrapper
} from '@/components/auth'

export default function SignupPage() {
  return (
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
      <main className="w-full">
        {/* Top Section - Signup Form and Sales Chart */}
        <section className="w-full pt-4 lg:pt-8 pb-8 lg:pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 min-h-[600px]">
            {/* Signup Form Section */}
            <div className="order-2 xl:order-1 flex justify-center xl:justify-center px-4 sm:px-6 lg:px-8 m-auto items-end w-full h-full">
              <SignupFormSection />
            </div>

            {/* Group Wrapper - Sales Funnel Chart */}
            <div className="order-1 xl:order-2 flex justify-center xl:justify-end px-4 sm:px-6 lg:px-8">
              <GroupWrapper />
            </div>
          </div>
        </section>

        {/* Hero Section with Background Images */}
        <section className="relative w-full py-16 lg:py-24">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Background Images - Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <img
                className="absolute w-[80px] h-[80px] lg:w-[114px] lg:h-[114px] top-[20%] left-[25%] aspect-[1] object-cover opacity-60"
                alt="Image"
                src="/img/image-16.png"
              />

              <img
                className="absolute w-4 h-4 lg:w-6 lg:h-6 top-[25%] left-[40%] aspect-[1] object-cover opacity-60"
                alt="Image"
                src="/img/image-19.png"
              />

              <img
                className="absolute w-[120px] h-[120px] lg:w-[202px] lg:h-[202px] top-[35%] right-[15%] aspect-[1] object-cover opacity-60"
                alt="Image"
                src="/img/image-18.png"
              />

              <img
                className="absolute w-[20px] h-[24px] lg:w-[30px] lg:h-8 top-[40%] left-[25%] aspect-[0.96] opacity-60"
                alt="Image"
                src="/img/image-17.png"
              />
            </div>

            <HeroSection />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-16 lg:py-24">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <PricingSection />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16 lg:py-24">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <FaqSection />
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="w-full">
        <FooterSection />
      </footer>
    </div>
  )
}
