import React from 'react'

interface BillingIconProps {
  className?: string
  color?: string
}

export const BillingIcon: React.FC<BillingIconProps> = ({
  className = 'w-5 h-5',
  color = '#000000'
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="17"
    viewBox="0 0 15 17"
    fill="none"
  >
    <path
      d="M4 5H11M4 9H11M2.3 1H12.7C13.418 1 14 1.67157 14 2.5V16L11.8333 14.5L9.66667 16L7.5 14.5L5.33333 16L3.16667 14.5L1 16V2.5C1 1.67157 1.58203 1 2.3 1Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)