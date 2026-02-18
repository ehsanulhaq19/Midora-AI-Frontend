import React from 'react'

interface FiltersProps {
  className?: string
  color?: string
}

export const Filters: React.FC<FiltersProps> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M2 4L10 4M2 10H10M10 10V12M10 10V8M2 16H6M10 16L18 16M14 10H18M14 4L18 4M14 4V6M14 4V2M6.5 18V14" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)
