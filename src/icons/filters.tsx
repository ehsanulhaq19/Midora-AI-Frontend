import React from 'react'

interface FiltersProps {
  className?: string
  color?: string
}

export const Filters: React.FC<FiltersProps> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => (
  <svg className={className}  width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 0.5H28.5C32.6421 0.5 36 3.85786 36 8V28C36 32.1421 32.6421 35.5 28.5 35.5H8.5C4.35786 35.5 1 32.1421 1 28V8C1 3.85786 4.35786 0.5 8.5 0.5Z" stroke={color} stroke-opacity="0.1"/>
    <path d="M10.5 12L18.5 12M10.5 18H18.5M18.5 18V20M18.5 18V16M10.5 24H14.5M18.5 24L26.5 24M22.5 18H26.5M22.5 12L26.5 12M22.5 12V14M22.5 12V10M15 26V22" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)
