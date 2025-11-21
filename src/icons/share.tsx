import React from 'react'

interface ShareProps {
  className?: string
  color?: string
}

export const Share: React.FC<ShareProps> = ({ 
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
    <g clipPath="url(#clip0_233_6987)">
      <path 
        d="M2.66699 7.99967V13.333C2.66699 13.6866 2.80747 14.0258 3.05752 14.2758C3.30756 14.5259 3.6467 14.6663 4.00033 14.6663H12.0003C12.3539 14.6663 12.6931 14.5259 12.9431 14.2758C13.1932 14.0258 13.3337 13.6866 13.3337 13.333V7.99967M10.667 3.99967L8.00033 1.33301M8.00033 1.33301L5.33366 3.99967M8.00033 1.33301V9.99967" 
        stroke={color} 
        strokeOpacity="0.9" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_233_6987">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

