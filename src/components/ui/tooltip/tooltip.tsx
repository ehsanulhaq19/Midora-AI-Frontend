import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'right',
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  const updateTooltipPosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.right + 8
          break
      }

      setTooltipPosition({ top, left })
    }
  }

  const showTooltip = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }
    const id = setTimeout(() => {
      setIsVisible(true)
      // Trigger animation after a brief moment
      requestAnimationFrame(() => {
        setIsAnimating(true)
        // Update position after tooltip is rendered
        requestAnimationFrame(() => {
          updateTooltipPosition()
        })
      })
    }, delay)
    timeoutId.current = id
  }

  const hideTooltip = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
    setIsAnimating(false)
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false)
    }, 150)
  }

  useEffect(() => {
    if (isVisible) {
      updateTooltipPosition()
      const handleResize = () => updateTooltipPosition()
      const handleScroll = () => updateTooltipPosition()
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, true)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [isVisible, position])

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const getArrowStyle = () => {
    const arrowSize = 6;
    switch (position) {
      case 'top':
        return {
          bottom: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid rgba(0, 0, 0, 0.85)`,
        }
      case 'bottom':
        return {
          top: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid rgba(0, 0, 0, 0.85)`,
        }
      case 'left':
        return {
          right: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid rgba(0, 0, 0, 0.85)`,
        }
      case 'right':
        return {
          left: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid rgba(0, 0, 0, 0.85)`,
        }
      default:
        return {}
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && typeof window !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className={`fixed z-[999999999] px-3 py-1.5 text-xs text-white rounded-md shadow-xl whitespace-nowrap pointer-events-none
            transition-all duration-150 ease-out
            ${isAnimating 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
            }`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transformOrigin: position === 'right' ? 'left center' : position === 'left' ? 'right center' : 'center center',
          }}
          role="tooltip"
        >
          {content}
          <div
            className="absolute w-0 h-0"
            style={getArrowStyle()}
          />
        </div>,
        document.body
      )}
    </>
  )
}
