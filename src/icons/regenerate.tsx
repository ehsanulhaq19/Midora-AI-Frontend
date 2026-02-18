import React from 'react'

interface RegenerateIconProps {
  className?: string
}

export const Regenerate: React.FC<RegenerateIconProps> = ({ className = "w-4 h-4" }) => {
  return (
    <svg 
      width="19" 
      height="19" 
      viewBox="0 0 19 19" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M13.0215 1.38574L16.0215 4.38574L13.0215 7.38574" 
        stroke="currentColor" 
        strokeOpacity="0.9" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M2.52148 8.88574V7.38574C2.52148 6.59009 2.83755 5.82703 3.40016 5.26442C3.96277 4.70181 4.72583 4.38574 5.52148 4.38574H16.0215" 
        stroke="currentColor" 
        strokeOpacity="0.9" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M5.52148 17.8857L2.52148 14.8857L5.52148 11.8857" 
        stroke="currentColor" 
        strokeOpacity="0.9" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16.0215 10.3857V11.8857C16.0215 12.6814 15.7054 13.4445 15.1428 14.0071C14.5802 14.5697 13.8171 14.8857 13.0215 14.8857H2.52148" 
        stroke="currentColor" 
        strokeOpacity="0.9" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
