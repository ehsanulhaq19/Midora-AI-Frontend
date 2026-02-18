import React from 'react'

interface LightbulbProps {
  className?: string
  color?: string
}

export const Lightbulb: React.FC<LightbulbProps> = ({ className, color = '#293241' }) => {
  return (
    <svg
    className={`w-6 h-6 text-gray-600 ${className}`}

      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9.6 21.6H14.4M6 8.4C6 5.08629 8.68629 2.4 12 2.4C15.3137 2.4 18 5.08629 18 8.4C18 10.8604 16.5191 12.8741 14.4 13.8V17.4C14.4 18.0627 13.8627 18.6 13.2 18.6H10.8C10.1373 18.6 9.6 18.0627 9.6 17.4V13.9007C7.48091 12.9749 6 10.8604 6 8.4Z"
        stroke={color}
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
