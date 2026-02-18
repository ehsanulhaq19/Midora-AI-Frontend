'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ScreenLoader } from './screen-loader'

interface LoadingWrapperProps {
  children: React.ReactNode
  /** Loading message */
  message?: string
  /** Minimum loading time in milliseconds */
  minLoadingTime?: number
  /** Whether to show loading initially */
  showInitially?: boolean
  /** Custom loading condition */
  isLoading?: boolean
}

/**
 * Loading wrapper component that shows a loader while content is loading
 * Provides smooth loading experience with configurable timing
 */
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  message = 'Loading...',
  minLoadingTime = 400,
  showInitially = true,
  isLoading: externalLoading
}) => {
  const [internalLoading, setInternalLoading] = useState(showInitially)
  const startTimeRef = useRef<number>(Date.now())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (externalLoading !== undefined) {
      // Use external loading state
      if (!externalLoading) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        const elapsed = Date.now() - startTimeRef.current
        const remainingTime = Math.max(0, minLoadingTime - elapsed)
        
        timeoutRef.current = setTimeout(() => {
          setInternalLoading(false)
        }, remainingTime)
      } else {
        // Reset start time when loading begins
        startTimeRef.current = Date.now()
        setInternalLoading(true)
      }
    } else if (showInitially) {
      // Use internal timing
      timeoutRef.current = setTimeout(() => {
        setInternalLoading(false)
      }, minLoadingTime)
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [externalLoading, showInitially, minLoadingTime])

  const shouldShowLoader = externalLoading !== undefined ? externalLoading : internalLoading

  if (shouldShowLoader) {
    return <ScreenLoader message={message} fullScreen={true} />
  }

  return <>{children}</>
}

export default LoadingWrapper
