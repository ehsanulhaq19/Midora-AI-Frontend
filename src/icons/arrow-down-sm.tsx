import React from 'react'

interface ArrowDownSmProps {
  className?: string
  color?: string
}

export const ArrowDownSm: React.FC<ArrowDownSmProps> = ({ 
  className = "w-3 h-3", 
  color = "#1F1740" 
}) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M10.375 6.83333L6 11M6 11L1.625 6.83333M6 11L6 1" 
      stroke={color} 
      strokeOpacity="0.9" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)
