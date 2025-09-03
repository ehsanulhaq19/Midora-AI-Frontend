/**
 * Custom Cursor System Types
 * Type definitions for the custom mouse cursor functionality
 */

export interface CursorDot {
  size: string
  color: string
  borderColor: string
  borderWidth: string
}

export interface CursorCircle {
  size: string
  color: string
  borderColor: string
  borderWidth: string
}

export interface CursorAnimation {
  duration: string
  easing: string
}

export interface CursorConfig {
  enabled: boolean
  dot: CursorDot
  circle: CursorCircle
  animation: CursorAnimation
}

export interface CursorPosition {
  x: number
  y: number
}

export interface CursorState {
  isEnabled: boolean
  enable: () => void
  disable: () => void
  toggle: () => void
}

export interface CustomCursorProps {
  enabled?: boolean
}

export interface CursorToggleProps {
  className?: string
  showLabel?: boolean
}

// Cursor event types
export type CursorEventType = 'mousemove' | 'mouseenter' | 'mouseleave'

export interface CursorEventHandlers {
  onMouseMove: (e: MouseEvent) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

// Cursor visibility states
export type CursorVisibility = 'visible' | 'hidden' | 'fading'

// Cursor interaction modes
export type CursorMode = 'default' | 'interactive' | 'disabled'

// Cursor animation states
export interface CursorAnimationState {
  isAnimating: boolean
  currentAnimation: string | null
  animationDuration: number
}
