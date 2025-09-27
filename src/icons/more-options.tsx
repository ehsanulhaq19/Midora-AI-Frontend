import React from 'react'

interface MoreOptionsProps {
  className?: string
  color?: string
}

export const MoreOptions: React.FC<MoreOptionsProps> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="1" fill={color}/>
    <circle cx="19" cy="12" r="1" fill={color}/>
    <circle cx="5" cy="12" r="1" fill={color}/>
  </svg>
)
