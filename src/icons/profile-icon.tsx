import React from 'react'

interface ProfileIconProps {
  className?: string
  color?: string
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  className = 'w-5 h-5',
  color = '#000000'
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="18"
    viewBox="0 0 16 18"
    fill="none"
  >
    <path
      d="M14.9995 17L14.9997 14.0003C14.9999 12.3433 13.6567 11 11.9997 11H4.00034C2.34361 11 1.00052 12.3429 1.00034 13.9997L1 17M11 4C11 5.65685 9.65685 7 8 7C6.34315 7 5 5.65685 5 4C5 2.34315 6.34315 1 8 1C9.65685 1 11 2.34315 11 4Z"
      stroke={color}
      strokeOpacity="1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)