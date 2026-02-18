import React from 'react'

interface FoldersProps {
  color?: string
  className?: string
}

export const Folders: React.FC<FoldersProps> = ({ 
  color = "#5E4D74", 
  className 
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
        d="M12.1027 19.5147H4.30368C2.97819 19.5147 1.90367 18.4402 1.90368 17.1147L1.90377 7.99037C1.90378 7.07645 1.90344 5.77472 1.90315 4.83217C1.90294 4.16925 2.44028 3.63248 3.10319 3.63248H8.82141L11.5864 6.58611H19.9027C20.5655 6.58611 21.1027 7.12337 21.1027 7.78611V10.9737M18.7027 20.3675L18.7027 16.9734M18.7027 16.9734L18.7027 13.5793M18.7027 16.9734L15.3086 16.9734M18.7027 16.9734L22.0969 16.9734"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
