import React from 'react'

interface CheckBroken4Props {
  color?: string
  opacity?: string
  className?: string
}

export const CheckBroken4: React.FC<CheckBroken4Props> = ({
  color = "white",
  opacity = "unset",
  className,
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.2 9C16.2 12.9765 12.9765 16.2 9.00005 16.2C5.0236 16.2 1.80005 12.9765 1.80005 9C1.80005 5.02355 5.0236 1.8 9.00005 1.8C10.1297 1.8 11.1986 2.06015 12.15 2.52381M14.85 4.5L8.55005 10.8L6.75005 9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={opacity}
        strokeWidth="1.5"
      />
    </svg>
  )
}
