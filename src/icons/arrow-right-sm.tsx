interface ArrowRightSmProps {
  color?: string
  className?: string
}

export const ArrowRightSm = ({ 
  color = "white", 
  className 
}: ArrowRightSmProps) => {
  return (
    <svg
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8333 5.625L15 10M15 10L10.8333 14.375M15 10L5 10"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
