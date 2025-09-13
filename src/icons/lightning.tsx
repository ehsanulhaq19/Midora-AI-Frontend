import React from 'react'

interface LightningProps {
  className?: string
}

export const Lightning: React.FC<LightningProps> = ({ className }) => {
  return (
    <svg 
      className={`w-6 h-6 text-gray-600 ${className}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon 
        points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
