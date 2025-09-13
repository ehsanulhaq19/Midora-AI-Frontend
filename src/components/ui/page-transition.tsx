'use client'

import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname()
  const [currentChildren, setCurrentChildren] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const previousPathname = useRef(pathname)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    // Skip transition on initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      setCurrentChildren(children)
      return
    }

    // Skip if same pathname
    if (previousPathname.current === pathname) {
      return
    }
    
    // Start exit animation
    setIsExiting(true)
    setIsAnimating(true)
    
    // After exit animation, update content and start enter animation
    const exitTimer = setTimeout(() => {
      setCurrentChildren(children)
      previousPathname.current = pathname
      setIsExiting(false)
      
      // Start enter animation
      const enterTimer = setTimeout(() => {
        setIsAnimating(false)
      }, 50) // Small delay to ensure DOM update
      
      return () => clearTimeout(enterTimer)
    }, 250) // Half of total animation duration
      
    return () => clearTimeout(exitTimer)
  }, [pathname, children])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className={`w-full h-full transition-all duration-500 ease-in-out ${
          isAnimating 
            ? (isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100')
            : 'opacity-100 scale-100'
        }`}
      >
        {currentChildren}
      </div>
    </div>
  )
}
