import React from 'react'

interface MenuProps {
  className?: string
}

export const Menu: React.FC<MenuProps> = ({ className }) => {
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
        d="M3 12H21M3 6H21M3 18H21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

