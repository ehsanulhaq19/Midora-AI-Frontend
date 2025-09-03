'use client'

import { useEffect, useState } from 'react'
import { theme } from '@/lib/theme'

interface CustomCursorProps {
  enabled?: boolean
}

export function CustomCursor({ enabled = theme.cursor.enabled }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      
      {/* Custom cursor container */}
      <div
        className="fixed pointer-events-none z-[9999] transition-all duration-150 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Outer circle */}
        <div
          className="absolute rounded-full border border-primary-400/40 bg-primary-500/20"
          style={{
            width: theme.cursor.circle.size,
            height: theme.cursor.circle.size,
            left: `calc(-${theme.cursor.circle.size} / 2)`,
            top: `calc(-${theme.cursor.circle.size} / 2)`,
            borderWidth: theme.cursor.circle.borderWidth,
            transition: `all ${theme.cursor.animation.duration} ${theme.cursor.animation.easing}`,
          }}
        />
        
        {/* Inner dot */}
        <div
          className="absolute rounded-full bg-primary-500 border-2 border-white shadow-lg"
          style={{
            width: theme.cursor.dot.size,
            height: theme.cursor.dot.size,
            left: `calc(-${theme.cursor.dot.size} / 2)`,
            top: `calc(-${theme.cursor.dot.size} / 2)`,
            borderWidth: theme.cursor.dot.borderWidth,
            transition: `all ${theme.cursor.animation.duration} ${theme.cursor.animation.easing}`,
          }}
        />
      </div>
    </>
  )
}
