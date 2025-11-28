import React from 'react'

interface TickIconProps {
  className?: string
  color?: string
}

export const TickIcon: React.FC<TickIconProps> = ({
  className,
  color = 'white',
}) => (
  <svg
    className={className}
    width="9"
    height="7"
    viewBox="0 0 9 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.834961 3.64746L3.02246 5.83496L8.02246 0.834961"
      stroke={color}
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)



