import React from 'react'

interface NotificationsIconProps {
  className?: string
  color?: string
}

export const NotificationsIcon: React.FC<NotificationsIconProps> = ({
  className = 'w-5 h-5',
  color = '#000000'
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M8 1H4C2.34315 1 1 2.34315 1 4V14.0001C1 15.6569 2.34315 17.0001 4 17.0001H14C15.6568 17.0001 17 15.6569 17 14.0001V9.5M17 3.5C17 4.88071 15.8807 6 14.5 6C13.1193 6 12 4.88071 12 3.5C12 2.11929 13.1193 1 14.5 1C15.8807 1 17 2.11929 17 3.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)