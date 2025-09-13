import React from 'react'

interface LightbulbProps {
  className?: string
}

export const Lightbulb: React.FC<LightbulbProps> = ({ className }) => {
  return (
    <svg 
      className={`w-6 h-6 text-gray-600 ${className}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 21h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="7" strokeWidth="2"/>
      <path d="M12 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 12h-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 12H2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.36 20.36l-1.42-1.42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.64 5.64L4.22 4.22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
