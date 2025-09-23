import React from 'react'

interface MinusSquareProps {
  color?: string
  opacity?: string
  className?: string
}

export const MinusSquare: React.FC<MinusSquareProps> = ({
  color = "black",
  opacity = "unset",
  className,
}) => {
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
        d="M15.6 2.39996V21.6001M21.6 5.99996L21.6 18.0001C21.6 19.9883 19.9882 21.6001 18 21.6001H5.99999C4.01177 21.6001 2.39999 19.9883 2.39999 18.0001V5.99996C2.39999 4.01174 4.01177 2.39996 5.99999 2.39996H18C19.9882 2.39996 21.6 4.01174 21.6 5.99996Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={opacity}
        strokeWidth="2"
      />
    </svg>
  )
}
