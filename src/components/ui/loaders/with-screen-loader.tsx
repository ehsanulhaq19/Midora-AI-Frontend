'use client'

import React, { useEffect, useState } from 'react'
import { PageLoader } from './page-loader'

interface WithScreenLoaderOptions {
  /** Initial loading message */
  loadingMessage?: string
  /** Minimum loading time in milliseconds */
  minLoadingTime?: number
  /** Whether to show loading on component mount */
  showOnMount?: boolean
}

/**
 * Simplified higher-order component that wraps components with automatic screen loading
 * Uses PageLoader for consistent and reliable loading behavior
 */
export function withScreenLoader<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithScreenLoaderOptions = {}
) {
  const {
    loadingMessage = 'Loading...',
    minLoadingTime = 600,
    showOnMount = true
  } = options

  const WithScreenLoaderComponent = (props: P) => {
    const [showLoader, setShowLoader] = useState(showOnMount)
    const [startTime] = useState(Date.now())

    useEffect(() => {
      if (!showOnMount) {
        return
      }

      const timer = setTimeout(() => {
        setShowLoader(false)
      }, minLoadingTime)

      return () => clearTimeout(timer)
    }, [showOnMount, minLoadingTime])

    if (showLoader) {
      return (
        <PageLoader 
          message={loadingMessage}
          minLoadingTime={minLoadingTime}
          showImmediately={true}
        />
      )
    }

    return <WrappedComponent {...props} />
  }

  WithScreenLoaderComponent.displayName = `withScreenLoader(${WrappedComponent.displayName || WrappedComponent.name})`

  return WithScreenLoaderComponent
}

export default withScreenLoader
