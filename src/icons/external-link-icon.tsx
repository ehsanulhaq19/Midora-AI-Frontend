import React from 'react'

interface ExternalLinkIconProps {
  className?: string
  color?: string
}

export const ExternalLinkIcon: React.FC<ExternalLinkIconProps> = ({
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
      d="M15 10V15C15 15.5523 14.5523 16 14 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44772 4.44772 5 5 5H10M12 3H16M16 3V7M16 3L7 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

