import React from 'react'

interface DownArrowSmProps {
  color?: string
  opacity?: string
  className?: string
}

export const DownArrowSm: React.FC<DownArrowSmProps> = ({
  color = "white",
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
        d="M16.375 12.8333L12 17M12 17L7.625 12.8333M12 17L12 7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={opacity}
        strokeWidth="2"
      />
    </svg>
  )
}
