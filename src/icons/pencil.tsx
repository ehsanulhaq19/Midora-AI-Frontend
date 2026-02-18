import React from 'react'

interface PencilProps {
  className?: string
  color?: string
}

export const Pencil: React.FC<PencilProps> = ({ 
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
    <path 
      d="M3.19961 10.3996L5.99961 12.7996M2.79961 10.3996L10.6872 2.23656C11.5365 1.38729 12.9134 1.38729 13.7627 2.23656C14.6119 3.08583 14.6119 4.46276 13.7627 5.31203L5.59961 13.1996L1.59961 14.3996L2.79961 10.3996Z" 
      stroke={color} 
      strokeOpacity="0.9" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

