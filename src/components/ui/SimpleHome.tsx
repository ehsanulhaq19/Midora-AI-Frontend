'use client'

import { useState, useEffect } from 'react'
import { CursorToggle } from './CursorToggle'

export function SimpleHome() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const steps = [
    {
      type: 'welcome',
      title: 'Welcome to Midora',
      subtitle: 'Your Gateway to AI Excellence',
      content: 'Experience the future of artificial intelligence with our comprehensive platform.',
    },
    {
      type: 'description',
      title: 'What is Midora?',
      subtitle: 'Multi-Model AI Platform',
      content: 'Access OpenAI, Gemini, Claude, and DeepSeek in one unified interface. Plus powerful tools for AI detection, plagiarism checking, and market intelligence.',
    },
    {
      type: 'features',
      title: 'Powerful Features',
      subtitle: 'Everything You Need',
      content: [
        'Multiple AI Models',
        'AI Detection Tools',
        'Market Intelligence',
        'Real-time Analysis'
      ],
    },
    {
      type: 'greeting',
      title: 'Join Our Community',
      subtitle: 'Building Strong Bonds',
      content: 'Connect with like-minded professionals, share insights, and grow together in the AI revolution. Your journey starts here.',
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Reset all states when step changes
    setShowTitle(false)
    setShowSubtitle(false)
    setShowContent(false)

    // Sequential show animation
    const showTitleTimer = setTimeout(() => setShowTitle(true), 200)
    const showSubtitleTimer = setTimeout(() => setShowSubtitle(true), 1200) // 1s after title
    const showContentTimer = setTimeout(() => setShowContent(true), 2200) // 1s after subtitle

    // Sequential hide animation after 5 seconds of content being visible
    const hideContentTimer = setTimeout(() => setShowContent(false), 7200) // 5s after content shows
    const hideSubtitleTimer = setTimeout(() => setShowSubtitle(false), 7500) // 0.3s after content hides
    const hideTitleTimer = setTimeout(() => setShowTitle(false), 7800) // 0.3s after subtitle hides

    // Wait 2 seconds after hide animation completes, then change to next step
    const nextStepTimer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 10100) // 2s wait + 0.3s after title hides

    return () => {
      clearTimeout(showTitleTimer)
      clearTimeout(showSubtitleTimer)
      clearTimeout(showContentTimer)
      clearTimeout(hideContentTimer)
      clearTimeout(hideSubtitleTimer)
      clearTimeout(hideTitleTimer)
      clearTimeout(nextStepTimer)
    }
  }, [currentStep, isVisible])

  const currentStepData = steps[currentStep]

  return (
    <section className="min-h-screen bg-primary-950 flex items-center justify-center pt-16">
      {/* Cursor Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <CursorToggle />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Message */}
        <div className="transition-all duration-1000 ease-out">
          {/* Title */}
          <div className={`transition-all duration-1000 ease-out ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {currentStepData.title}
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className={`transition-all duration-1000 ease-out ${showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-2xl md:text-3xl font-medium text-primary-200 mb-8">
              {currentStepData.subtitle}
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className={`transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {currentStepData.type === 'features' ? (
            <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
              {currentStepData.content.map((feature: string, index: number) => (
                <div
                  key={index}
                  className={`text-lg text-white transition-all duration-700 ease-out px-3 py-2`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: showContent ? 'slideInFromRight 0.7s ease-out forwards' : 'none'
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl text-primary-100 leading-relaxed max-w-3xl mx-auto px-4">
              {currentStepData.content}
            </p>
          )}
        </div>

        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-800 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-primary-700 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-primary-600 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
    </section>
  )
}
