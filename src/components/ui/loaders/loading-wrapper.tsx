'use client'

import React, { useEffect, useState } from 'react'
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
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (externalLoading !== undefined) {
      // Use external loading state
      if (!externalLoading) {
        const elapsed = Date.now() - startTime
        const remainingTime = Math.max(0, minLoadingTime - elapsed)
        
        setTimeout(() => {
          setInternalLoading(false)
        }, remainingTime)
      } else {
        setInternalLoading(true)
      }
    } else if (showInitially) {
      // Use internal timing
      const timer = setTimeout(() => {
        setInternalLoading(false)
      }, minLoadingTime)

      return () => clearTimeout(timer)
    }
  }, [externalLoading, showInitially, minLoadingTime, startTime])

  const shouldShowLoader = externalLoading !== undefined ? externalLoading : internalLoading

  if (shouldShowLoader) {
    return <ScreenLoader message={message} fullScreen={true} />
  }

  return <>{children}</>
}

export default LoadingWrapper
