'use client'

import React, { useEffect, useState } from 'react'
import { t, tWithParams } from '@/i18n'

interface AnimatedSliderProps {
  userName: string
}

interface SliderContent {
  title: string
  description: string
}

export function AnimatedSlider({ userName }: AnimatedSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const slides: SliderContent[] = [
    {
      title: tWithParams('chat.slider.welcome', { name: userName }),
      description: 'We are excited to have you here and ready to show you what Midora can do for you.'
    },
    {
      title: t('chat.slider.aboutMidora'),
      description: t('chat.slider.aboutMidoraDescription')
    },
    {
      title: t('chat.slider.features'),
      description: t('chat.slider.featuresDescription')
    },
    {
      title: t('chat.slider.launchingSoon'),
      description: t('chat.slider.launchingSoonDescription')
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsVisible(true)
      }, 1000)
    }, 4000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="min-h-[400px] flex items-center justify-center">
        <div
          className={`transition-all duration-500 ease-in-out text-center px-6 ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="flex justify-center space-x-2 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-primary-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => {
                setCurrentSlide(index)
                setIsVisible(true)
              }, 300)
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
