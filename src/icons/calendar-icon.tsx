import React from 'react'

interface CalendarIconProps {
  className?: string
  color?: string
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({
  className = 'w-5 h-5',
  color = '#000000'
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M6 2V4M14 2V4M3 8H17M4 4H16C16.5523 4 17 4.44772 17 5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

