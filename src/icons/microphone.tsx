import React from 'react'

interface MicrophoneProps {
  className?: string
  color?: string
}

export const Microphone: React.FC<MicrophoneProps> = ({ 
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
      d="M12 2C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V4C10 2.89543 10.8954 2 12 2Z" 
      stroke={color} 
      strokeWidth="2"
    />
    <path 
      d="M19 10V12C19 16.4183 15.4183 20 11 20H13C17.4183 20 21 16.4183 21 12V10" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 20V24M8 24H16" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)
