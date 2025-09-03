'use client'

import { ReactNode, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AuthLandingPageProps {
  children: ReactNode
  className?: string
}

export function AuthLandingPage({ children, className }: AuthLandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    "Access OpenAI, Gemini, Claude,\nand DeepSeek models for any task",
    "AI detection, plagiarism checking,\nand content analysis tools",
    "Stock alerts, portfolio tracking,\nand risk assessment powered by AI",
    "Join millions of users who trust\nMidora AI for their daily tasks",
    "Experience the future of\nAI-powered problem solving",
    "Advanced algorithms for\nintelligent decision making"
  ]

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className={cn('min-h-screen flex', className)}>
      {/* Left Side - White Background with Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right Side - Light Purple Background with Simple Text Slider */}
      <div className="hidden lg:flex w-1/2 bg-purple-50 flex-col items-center justify-center p-12">
        <div className="w-full max-w-none">
          {/* Simple Text Slider */}
          <div className="relative h-32 flex items-center justify-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                  index === currentSlide
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-8'
                }`}
              >
                <p className="text-xl text-gray-700 leading-relaxed text-center px-8 whitespace-pre-line">
                  {slide}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
