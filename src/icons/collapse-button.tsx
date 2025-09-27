import React from 'react'

interface CollapseButtonProps {
  className?: string
  color?: string
}

export const CollapseButton: React.FC<CollapseButtonProps> = ({ 
  className = "w-6 h-6", 
  color = "#1F1740" 
}) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M15.5999 2.3999V21.6M21.5999 5.9999L21.5999 18C21.5999 19.9882 19.9881 21.6 17.9999 21.6H5.9999C4.01168 21.6 2.3999 19.9882 2.3999 18V5.9999C2.3999 4.01168 4.01168 2.3999 5.9999 2.3999H17.9999C19.9881 2.3999 21.5999 4.01168 21.5999 5.9999Z" 
      stroke={color} 
      strokeOpacity="0.9" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)
