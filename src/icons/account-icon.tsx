import React from 'react'

interface AccountIconProps {
  className?: string
  color?: string
}

export const AccountIcon: React.FC<AccountIconProps> = ({
  className = 'w-5 h-5',
  color = '#000000'
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
  >
    <path
      d="M10.7059 4.5V2.75C10.7059 2.28587 10.52 1.84075 10.189 1.51256C9.85807 1.18437 9.40921 1 8.94118 1H2.76471C2.29668 1 1.84782 1.18437 1.51687 1.51256C1.18592 1.84075 1 2.28587 1 2.75V13.25C1 13.7141 1.18592 14.1592 1.51687 14.4874C1.84782 14.8156 2.29668 15 2.76471 15H8.94118C9.40921 15 9.85807 14.8156 10.189 14.4874C10.52 14.1592 10.7059 13.7141 10.7059 13.25V11.5M5.41176 8H16M16 8L13.3529 5.375M16 8L13.3529 10.625"
      stroke={color}
      strokeOpacity="1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)