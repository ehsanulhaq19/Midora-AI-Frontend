import React from 'react'

interface PaperclipProps {
  className?: string
}

export const Paperclip: React.FC<PaperclipProps> = ({ className }) => {
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
        d="M9.85714 7.92857V13.9286C9.85714 15.112 10.8165 16.0714 12 16.0714C13.1835 16.0714 14.1429 15.112 14.1429 13.9286V7.71429C14.1429 5.4657 12.32 3.64286 10.0714 3.64286C7.82284 3.64286 6 5.4657 6 7.71428V14.3571C6 17.6709 8.68629 20.3571 12 20.3571C15.3137 20.3571 18 17.6709 18 14.3571V7.92857"
        stroke="#293241"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
