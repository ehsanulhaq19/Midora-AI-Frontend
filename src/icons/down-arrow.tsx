import React from 'react'

interface DownArrowProps {
  className?: string
  color?: string
  opacity?: string
}

export const DownArrow: React.FC<DownArrowProps> = ({
  className = "w-6 h-6",
  color = "#1F1740",
  opacity = "0.9",
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.375 12.8333L12 17M12 17L7.625 12.8333M12 17L12 7"
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

