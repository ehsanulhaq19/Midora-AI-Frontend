import React from 'react'

interface InvoiceIconProps {
  className?: string
  color?: string
}

export const InvoiceIcon: React.FC<InvoiceIconProps> = ({
  className = 'w-6 h-6',
  color = 'currentColor'
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M15.0006 2.40039V6.00039C15.0006 6.66313 15.5378 7.20039 16.2006 7.20039H19.8006M8.40057 7.20039H10.8006M8.40057 10.8004H15.6006M8.40057 14.4004H15.6006M18.0006 4.20039C17.4665 3.72253 16.9123 3.15577 16.5624 2.78767C16.3296 2.54273 16.0079 2.40039 15.67 2.40039H6.60029C5.27481 2.40039 4.2003 3.4749 4.20029 4.80038L4.2002 19.2003C4.20019 20.5258 5.2747 21.6003 6.60019 21.6003L17.4002 21.6004C18.7257 21.6004 19.8002 20.5259 19.8002 19.2004L19.8006 6.47822C19.8006 6.17138 19.6835 5.87643 19.4706 5.65552C19.0768 5.24704 18.4191 4.57491 18.0006 4.20039Z"
      stroke={color}
      strokeOpacity="0.9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

