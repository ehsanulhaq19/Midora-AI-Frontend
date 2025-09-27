import React from 'react'

interface Image26Props {
  className?: string
  color?: string
}

export const Image26: React.FC<Image26Props> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
  >
    <defs>
      <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="24" height="24">
        <rect width="24" height="24" fill={color} opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="24" height="24" fill="url(#imagePattern)"/>
    <path 
      d="M4 4H20V20H4V4ZM6 6V18H18V6H6ZM8 8H16V10H8V8ZM8 12H16V14H8V12ZM8 16H12V18H8V16Z" 
      fill={color} 
      opacity="0.3"
    />
  </svg>
)
