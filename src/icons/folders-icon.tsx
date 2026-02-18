import React from 'react'

interface FoldersIconProps {
  className?: string
  color?: string
}

export const FoldersIcon: React.FC<FoldersIconProps> = ({
  className = "w-5 h-5",
  color = "#1F1740",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="16"
    viewBox="0 0 19 16"
    fill="none"
    className={className}
  >
    <path
      d="M9.24966 13.9852H2.75045C1.64587 13.9852 0.750435 13.0897 0.750446 11.9852L0.750521 4.38158C0.750526 3.61998 0.750242 2.5352 0.75 1.74974C0.74983 1.19731 1.19761 0.75 1.75004 0.75H6.51522L8.81941 3.21136H15.7497C16.3019 3.21136 16.7497 3.65908 16.7497 4.21136V6.86768M14.7497 14.6959L14.7497 11.8674M14.7497 11.8674L14.7497 9.03902M14.7497 11.8674L11.9212 11.8674M14.7497 11.8674L17.5781 11.8674"
      stroke={color}
      strokeOpacity="0.9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

