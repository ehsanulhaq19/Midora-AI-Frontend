import React from 'react'

interface StarProps {
  className?: string
  color?: string
}

export const Star: React.FC<StarProps> = ({ className, color = '#6B4392' }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.07583 2.64344C9.39329 1.78552 10.6067 1.78552 10.9242 2.64344L12.5043 6.91355C12.6041 7.18328 12.8167 7.39594 13.0864 7.49575L17.3566 9.07583C18.2145 9.39329 18.2145 10.6067 17.3566 10.9242L13.0864 12.5043C12.8167 12.6041 12.6041 12.8167 12.5043 13.0864L10.9242 17.3566C10.6067 18.2145 9.39329 18.2145 9.07583 17.3566L7.49575 13.0864C7.39594 12.8167 7.18328 12.6041 6.91355 12.5043L2.64344 10.9242C1.78552 10.6067 1.78552 9.39329 2.64344 9.07583L6.91355 7.49575C7.18328 7.39594 7.39594 7.18328 7.49575 6.91355L9.07583 2.64344Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
