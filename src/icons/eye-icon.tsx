import React from 'react'

interface EyeIconProps {
  className?: string
  color?: string
}

export const EyeIcon: React.FC<EyeIconProps> = ({
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
      d="M10 4C6 4 2.73 7.11 1 11.5C2.73 15.89 6 19 10 19C14 19 17.27 15.89 19 11.5C17.27 7.11 14 4 10 4ZM10 16.5C7.24 16.5 5 14.26 5 11.5C5 8.74 7.24 6.5 10 6.5C12.76 6.5 15 8.74 15 11.5C15 14.26 12.76 16.5 10 16.5ZM10 8.5C8.62 8.5 7.5 9.62 7.5 11C7.5 12.38 8.62 13.5 10 13.5C11.38 13.5 12.5 12.38 12.5 11C12.5 9.62 11.38 8.5 10 8.5Z"
      fill={color}
    />
  </svg>
)

