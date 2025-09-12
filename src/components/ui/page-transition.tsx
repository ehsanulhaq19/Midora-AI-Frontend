'use client'

import React, { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const currentStep = getStepNumber(pathname)
    const previousStep = getStepNumber(previousPathname.current)
    
    if (currentStep > previousStep) {
      setSlideDirection('right')
    } else if (currentStep < previousStep) {
      setSlideDirection('left')
    }

    setIsVisible(false)

    const timer = setTimeout(() => {
      setIsVisible(true)
      previousPathname.current = pathname
    }, 50)

    return () => clearTimeout(timer)
  }, [pathname])

  const getStepNumber = (path: string): number => {
    if (path.includes('/welcome')) return 1
    if (path.includes('/full-name')) return 2
    if (path.includes('/profession')) return 3
    return 0
  }

  const getTransformClass = () => {
    if (isVisible) {
      return 'opacity-100 transform translate-x-0'
    } else {
      return slideDirection === 'right' 
        ? 'opacity-0 transform translate-x-full'
        : 'opacity-0 transform -translate-x-full'
    }
  }

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${getTransformClass()}`}
    >
      {children}
    </div>
  )
}
