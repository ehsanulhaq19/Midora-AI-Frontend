import React from 'react'

interface GridProps {
  className?: string
}

export const Grid: React.FC<GridProps> = ({ className }) => {
  return (
    <svg 
      className={`w-6 h-6 text-gray-600 ${className}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
    </svg>
  )
}
