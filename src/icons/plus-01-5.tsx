import React from 'react'

interface Plus01_5Props {
  color?: string
  opacity?: string
  className?: string
}

export const Plus01_5: React.FC<Plus01_5Props> = ({
  color = "#1F1740",
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
        d="M12 4.8L12 19.2M19.2 12L4.79999 12"
        stroke={color}
        strokeLinecap="round"
        strokeOpacity={opacity}
        strokeWidth="2"
      />
    </svg>
  )
}
