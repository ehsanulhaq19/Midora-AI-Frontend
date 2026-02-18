import React from 'react'

interface ArchiveProps {
  className?: string
  color?: string
}

export const Archive: React.FC<ArchiveProps> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_233_6993)">
      <path 
        d="M14.0003 5.33333V14H2.00033V5.33333M6.66699 8H9.33366M0.666992 2H15.3337V5.33333H0.666992V2Z" 
        stroke={color} 
        strokeOpacity="0.9" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_233_6993">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

