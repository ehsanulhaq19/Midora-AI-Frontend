'use client'

import React, { useEffect, useState } from 'react'
import { ScreenLoader } from './screen-loader'

interface PageLoaderProps {
  /** Loading message */
  message?: string
  /** Minimum loading time in milliseconds */
  minLoadingTime?: number
  /** Whether to show loading immediately */
  showImmediately?: boolean
}

/**
 * Simple page loader component that handles timing automatically
 * Shows loader for a minimum time to prevent flashing
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  minLoadingTime = 600,
  showImmediately = true
}) => {
  const [showLoader, setShowLoader] = useState(showImmediately)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (!showImmediately) {
      setShowLoader(true)
    }

    const timer = setTimeout(() => {
      setShowLoader(false)
    }, minLoadingTime)

    return () => clearTimeout(timer)
  }, [minLoadingTime, showImmediately])

  if (!showLoader) {
    return null
  }

  return <ScreenLoader message={message} fullScreen={true} />
}

export default PageLoader
