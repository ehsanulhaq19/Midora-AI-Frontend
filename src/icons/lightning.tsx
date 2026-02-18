import React from 'react'

interface LightningProps {
  className?: string
}

export const Lightning: React.FC<LightningProps> = ({ className }) => {
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
        d="M10.2222 14.4889L9.51105 21.6L18.7555 11.6444L13.7777 8.79999L14.4888 2.39999L5.24438 12.3555L10.2222 14.4889Z"
        stroke="#293241"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
