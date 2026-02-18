import React from 'react'

interface ArrowUpSmProps {
  color?: string
  className?: string
}

export const ArrowUpSm: React.FC<ArrowUpSmProps> = ({ 
  color = "black", 
  className 
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.625 11.1667L12 7M12 7L16.375 11.1667M12 7L12 17"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
