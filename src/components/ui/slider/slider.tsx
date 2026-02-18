'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowRightSm } from '@/icons'

interface SliderProps {
  children: React.ReactNode[]
  className?: string
  showArrows?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  slidesToShow?: number
  slidesToScroll?: number
  infinite?: boolean
  centerMode?: boolean
  centerPadding?: string
}

interface NavigationArrowProps {
  direction: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
  className?: string
}

const NavigationArrow: React.FC<NavigationArrowProps> = ({ 
  direction, 
  onClick, 
  disabled = false, 
  className = '' 
}) => {
  const isLeft = direction === 'left'
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        w-10 h-10 rounded-full
        bg-white/90 hover:bg-white
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:bg-white/90
        ${isLeft ? '-left-5' : '-right-5'}
        ${className}
      `}
      aria-label={`${direction} navigation`}
    >
      <ArrowRightSm 
        color="#293241" 
        className={`w-5 h-5 transition-transform duration-200 ${
          isLeft ? 'rotate-180' : ''
        }`} 
      />
    </button>
  )
}

export const Slider: React.FC<SliderProps> = ({
  children,
  className = '',
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  slidesToShow = 1,
  slidesToScroll = 1,
  infinite = true,
  centerMode = false,
  centerPadding = '0px'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const totalSlides = children.length
  
  // Early return if no children
  if (totalSlides === 0) {
    return <div className={`relative w-full ${className}`}>No content to display</div>
  }
  
  // For infinite mode, we need to handle the circular logic
  const getMaxIndex = () => {
    if (infinite) return totalSlides - 1
    return Math.max(0, totalSlides - slidesToShow)
  }
  
  const maxIndex = getMaxIndex()

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    
    if (infinite) {
      // Handle circular navigation
      let newIndex = index
      if (index < 0) {
        newIndex = totalSlides - 1
      } else if (index >= totalSlides) {
        newIndex = 0
      }
      setCurrentIndex(newIndex)
    } else {
      // Handle bounded navigation - allow initial render
      const clampedIndex = Math.max(0, Math.min(index, maxIndex))
      setCurrentIndex(clampedIndex)
    }
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const nextSlide = () => {
    if (infinite) {
      goToSlide(currentIndex + slidesToScroll)
    } else {
      const nextIndex = Math.min(currentIndex + slidesToScroll, maxIndex)
      goToSlide(nextIndex)
    }
  }

  const prevSlide = () => {
    if (infinite) {
      goToSlide(currentIndex - slidesToScroll)
    } else {
      const prevIndex = Math.max(currentIndex - slidesToScroll, 0)
      goToSlide(prevIndex)
    }
  }

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && totalSlides > slidesToShow) {
      autoPlayRef.current = setInterval(() => {
        if (infinite) {
          setCurrentIndex(prev => (prev + slidesToScroll) % totalSlides)
        } else {
          setCurrentIndex(prev => {
            const next = prev + slidesToScroll
            return next > maxIndex ? 0 : next
          })
        }
      }, autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, slidesToScroll, maxIndex, totalSlides, slidesToShow, infinite])

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  const canGoNext = infinite || currentIndex < maxIndex
  const canGoPrev = infinite || currentIndex > 0

  // Calculate slide width - each slide should be 100% of container width
  const slideWidth = 100

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={sliderRef}
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * slideWidth}%)`
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ 
                width: `${slideWidth}%`,
                paddingLeft: centerMode && index === 0 ? centerPadding : '0px',
                paddingRight: centerMode && index === totalSlides - 1 ? centerPadding : '0px'
              }}
            >
              <div className="flex justify-center h-full">
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && totalSlides > slidesToShow && (
        <>
          <NavigationArrow
            direction="left"
            onClick={prevSlide}
            disabled={!canGoPrev}
          />
          <NavigationArrow
            direction="right"
            onClick={nextSlide}
            disabled={!canGoNext}
          />
        </>
      )}

      {/* Dots indicator */}
      {totalSlides > slidesToShow && !infinite && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(totalSlides / slidesToScroll) }).map((_, index) => {
            const dotIndex = index * slidesToScroll
            return (
              <button
                key={index}
                onClick={() => goToSlide(dotIndex)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex >= dotIndex && currentIndex < dotIndex + slidesToScroll
                    ? 'bg-tokens-color-surface-surface-button'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}