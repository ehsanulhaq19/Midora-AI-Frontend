import React from 'react'

interface TrashProps {
  className?: string
  color?: string
}

export const Trash: React.FC<TrashProps> = ({ 
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
      d="M1.59961 3.6002H14.3996M5.59961 1.2002H10.3996M6.39961 11.6002V6.8002M9.59961 11.6002V6.8002M10.7996 14.8002H5.19961C4.31595 14.8002 3.59961 14.0839 3.59961 13.2002L3.23433 4.4335C3.21539 3.979 3.57874 3.6002 4.03364 3.6002H11.9656C12.4205 3.6002 12.7838 3.979 12.7649 4.4335L12.3996 13.2002C12.3996 14.0839 11.6833 14.8002 10.7996 14.8002Z" 
      stroke={color} 
      strokeOpacity="0.9" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

