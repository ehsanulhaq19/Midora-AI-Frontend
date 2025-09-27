import React from 'react'

interface FolderOpenProps {
  className?: string
  color?: string
}

export const FolderOpen: React.FC<FolderOpenProps> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)