import React from 'react'

interface CheckBrokenProps {
  className?: string
}

export const CheckBroken: React.FC<CheckBrokenProps> = ({ className }) => {
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
        d="M21.6 12C21.6 17.3019 17.3019 21.6 12 21.6C6.69807 21.6 2.4 17.3019 2.4 12C2.4 6.69807 6.69807 2.4 12 2.4C13.5062 2.4 14.9314 2.74687 16.2 3.36508M19.8 6L11.4 14.4L9 12"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
