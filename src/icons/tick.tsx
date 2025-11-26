import React from 'react'

interface TickIconProps {
  className?: string
  color?: string
}

export const TickIcon: React.FC<TickIconProps> = ({
  className,
  color = '#ffffff',
}) => (
  <svg
    className={className}
    width="14"
    height="11"
    viewBox="0 0 14 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 6L4.5 9.5L13 1"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)


