import React from 'react'

interface Icon6122191Props {
  className?: string
  color?: string
}

export const Icon6122191: React.FC<Icon6122191Props> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
  >
    <defs>
      <pattern id="iconPattern" patternUnits="userSpaceOnUse" width="24" height="24">
        <rect width="24" height="24" fill={color} opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="24" height="24" fill="url(#iconPattern)"/>
    <circle 
      cx="12" 
      cy="12" 
      r="8" 
      stroke={color} 
      strokeWidth="2" 
      fill="none"
    />
    <path 
      d="M8 12L10.5 14.5L16 9" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)
