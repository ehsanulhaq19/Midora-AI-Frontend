'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  HeroSection, 
  SignupFormSection, 
  PricingSection, 
  FaqSection, 
  FooterSection,
  GroupWrapper
} from '@/components/auth'
import { MultiStepContainer } from '@/components/auth/signup-steps/multi-step-container'
import { useSignupData, SignupDataProvider } from '@/contexts/SignupDataContext'
import { LoadingWrapper } from '@/components/ui/loaders'
import { handleApiError } from '@/lib/error-handler'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { tokenManager } from '@/lib/token-manager'
import { setTokens } from '@/lib/auth'
import { useRouter } from 'next/navigation'

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { data, updateData } = useSignupData()
  const { error: showErrorToast, success: showSuccessToast } = useToast()
  const { getCurrentUser, updateProfile, completeOnboarding } = useAuth()
  
  const stepParam = searchParams.get('step')
  const isInOnboardingFlow = stepParam && ['welcome', 'fullName', 'profession', 'password', 'otp', 'success'].includes(stepParam)
  
  const [showOnboarding, setShowOnboarding] = useState(isInOnboardingFlow)
  const [isSSOOnboarding, setIsSSOOnboarding] = useState(false)
  const [isProcessingSSO, setIsProcessingSSO] = useState(false)
  const [initialOnboardingStep, setInitialOnboardingStep] = useState<string | undefined>(stepParam || undefined)
  
  useEffect(() => {
    if (isInOnboardingFlow) {
      setShowOnboarding(true)
      setInitialOnboardingStep(stepParam || undefined)
    } else {
      setShowOnboarding(false)
      setInitialOnboardingStep(undefined)
    }
  }, [stepParam, isInOnboardingFlow])

  useEffect(() => {
    const checkSSOOnboarding = async () => {
      tokenManager.debugTokenState()
      const tokens = tokenManager.getTokens()
      if (tokens.accessToken && tokens.refreshToken && !isProcessingSSO) {
        try {
          const userData = await getCurrentUser()
          if (userData && !userData.is_onboarded) { 
            // Store user data for SSO onboarding
            updateData({ 
              email: userData.email,
              fullName: `${userData.first_name} ${userData.last_name}`.trim()
            })
            // Show SSO onboarding flow with query parameter
            setIsSSOOnboarding(true)
            const params = new URLSearchParams(searchParams.toString())
            params.set('step', 'welcome')
            router.push(`/signup?${params.toString()}`, { scroll: false })
            setShowOnboarding(true)
          } else if (userData && userData.is_onboarded) {
            // User is already onboarded, redirect to chat
            dispatch(loginSuccess({
              user: userData,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              authMethod: (tokens.authMethod as 'google' | 'microsoft' | 'github') || 'email'
            }))
            router.push('/chat')
          }
        } catch (err: any) {
          console.error('SSO onboarding check error:', err)
          // Clear invalid tokens
          tokenManager.clearTokens()
        } finally {
          dispatch(setLoading(false))
        }
      }
    }

    // Only check if we're not already processing SSO and no query params
    if (!isProcessingSSO && searchParams.has('access_token') && searchParams.has('refresh_token')) {
      tokenManager.storeTokens(searchParams.get('access_token')!, searchParams.get('refresh_token')!, searchParams.get('auth_method')!)
      console.log('Stored tokens from query params')
      checkSSOOnboarding()
    }
  }, [dispatch, router, isProcessingSSO, searchParams])

  const handleOnboardingComplete = async (onboardingData: { email: string; fullName: string; profession: string }) => {
    try {
      // For SSO onboarding, we need to update the user profile
      if (isSSOOnboarding) {
        const [firstName, ...lastNameParts] = onboardingData.fullName.split(' ')
        const lastName = lastNameParts.join(' ')
        
        // Mark user as onboarded with profile data
        await completeOnboarding({
          first_name: firstName,
          last_name: lastName,
          profession: [onboardingData.profession]
        })
        // Redirect to chat
        router.push('/chat')
      } else {
        // For regular signup, proceed to password step
        setShowOnboarding(false)
        // The password step will be handled by the existing flow
      }
    } catch (err: any) {
      console.error('Onboarding completion error:', err)
      showErrorToast('Onboarding Failed', handleApiError(err))
    }
  }

  const handleOnShowOnboarding = (step?: string) => {
    // Navigate to the appropriate step using query parameters
    const params = new URLSearchParams(searchParams.toString())
    if (step) {
      params.set('step', step)
      setInitialOnboardingStep(step)
    } else {
      params.set('step', 'welcome')
      setInitialOnboardingStep('welcome')
    }
    router.push(`/signup?${params.toString()}`, { scroll: false })
    setShowOnboarding(true)
  }
  // Show onboarding flow in full screen blank layout if needed
  if (showOnboarding) {
    return (
      <LoadingWrapper 
        message="Setting up your account..."
        minLoadingTime={300}
        showInitially={true}
      >
        <div className="fixed inset-0 w-full h-full bg-[color:var(--tokens-color-surface-surface-primary)] flex flex-col justify-between">
          {/* Main content area */}
          <div className="flex-1 flex justify-center px-4 py-24">
            <div className="w-full">
              <MultiStepContainer 
                onComplete={handleOnboardingComplete}
                initialEmail={data.email}
                initialFullName={data.fullName}
                initialPassword={data.password}
                isSSOOnboarding={isSSOOnboarding}
                initialStep={initialOnboardingStep as any}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-center px-4 pb-8">
            <p className="font-h02-heading02 font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-center  max-w-full">
              <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                All rights reserved@ 2025, midora.ai, You can view our{" "}
              </span>
              <button 
            className="underline underline-offset-0 decoration-0 [text-decoration-skip-ink:auto] [color:var(--tokens-color-text-text-inactive-2)] hover:text-gray-700 transition-colors cursor-pointer"
          >
            Privacy Policy
            </button>
          
              <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {" "}here
              </span>
            </p>
          </div>
        </div>
      </LoadingWrapper>
    )
  }

  // Show original signup page content
  return (
    <LoadingWrapper 
      message="Loading signup..."
      minLoadingTime={300}
      showInitially={true}
    >
      <div className="relative min-h-screen w-auto bg-[color:var(--tokens-color-surface-surface-primary)]">
        {/* Header with Logo */}
        <header className="relative top-[37px] left-[-2px] md:left-[44px] w-auto md:absolute h-[60px]">
          <div className="max-w-7xl mx-auto ml-0">
            <div className="flex justify-center">
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
          <section className="w-full pt-4 lg:pt-8 pb-6 lg:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 min-h-[600px]">
              {/* Signup Form Section */}
              <div className="order-1 lg:order-1 flex justify-center lg:justify-center px-4 sm:px-6 lg:px-8 m-auto items-end w-full h-full">
                <SignupFormSection onShowOnboarding={(step: string | undefined) => handleOnShowOnboarding(step)} />
              </div>

              {/* Group Wrapper - Sales Funnel Chart */}
              <div className="order-2 lg:order-2 flex justify-center lg:justify-end px-4 sm:px-6 lg:px-8">
                <GroupWrapper />
              </div>
            </div>
          </section>

          {/* Hero Section with Background Images */}
          <section className="relative w-full pt-16 pb-8 lg:pt-24 lg:pb-16">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              {/* Background Images - Hidden on mobile, visible on larger screens */}
              <div className="hidden lg:block absolute inset-0 pointer-events-none">
                <img
                  className="absolute w-[80px] h-[80px] lg:w-[114px] lg:h-[114px] top-[43.5%] left-[31%] aspect-[1] object-cover opacity-90"
                  alt="Image"
                  src="/img/image-16.png"
                />

                {/* <img
                  className="absolute w-4 h-4 lg:w-6 lg:h-6 top-[25%] left-[40%] aspect-[1] object-cover opacity-60"
                  alt="Image"
                  src="/img/image-19.png"
                /> */}

                <img
                  className="absolute w-[120px] h-[120px] lg:w-[202px] lg:h-[202px] top-[67%] right-[31%] aspect-[1] object-cover opacity-60"
                  alt="Image"
                  src="/img/image-18.png"
                />

                {/* <img
                  className="absolute w-[20px] h-[24px] lg:w-[30px] lg:h-8 top-[40%] left-[25%] aspect-[0.96] opacity-60"
                  alt="Image"
                  src="/img/image-17.png"
                /> */}
              </div>

              <HeroSection />
            </div>
          </section>

          {/* Pricing Section */}
          <section className="w-full py-8 lg:py-16">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <PricingSection />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full pt-8 pb-32 lg:pb-32 ">
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
    </LoadingWrapper>
  )
}

export default function SignupPage() {
  return (
    <SignupDataProvider>
      <SignupPageContent />
    </SignupDataProvider>
  )
}
