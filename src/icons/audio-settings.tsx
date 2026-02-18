import React from 'react'

interface AudioSettingsProps {
  color?: string
  className?: string
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({ 
  color = "black", 
  className 
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4L10 4M2 10H10M10 10V12M10 10V8M2 16H6M10 16L18 16M14 10H18M14 4L18 4M14 4V6M14 4V2M6.5 18V14"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
