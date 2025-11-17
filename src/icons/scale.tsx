import React from 'react'

interface ScaleProps {
  className?: string
  color?: string
}

export const Scale: React.FC<ScaleProps> = ({ className, color = '#6B4392' }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 9V5M15 5L11.2695 5M15 5L10.5556 9.44444M2 11H7C8.10457 11 9 11.8954 9 13L9 18M16.2222 2L3.77778 2C2.79594 2 2 2.79594 2 3.77778L2 16.2222C2 17.2041 2.79594 18 3.77778 18L16.2222 18C17.2041 18 18 17.2041 18 16.2222L18 3.77778C18 2.79594 17.2041 2 16.2222 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
