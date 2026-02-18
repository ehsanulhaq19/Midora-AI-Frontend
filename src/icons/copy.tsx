import React from 'react'

interface CopyProps {
  className?: string
  color?: string
}

export const Copy: React.FC<CopyProps> = ({ 
  className = ""
}) => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15.2715 7.38574H8.52148C7.69306 7.38574 7.02148 8.05731 7.02148 8.88574V15.6357C7.02148 16.4642 7.69306 17.1357 8.52148 17.1357H15.2715C16.0999 17.1357 16.7715 16.4642 16.7715 15.6357V8.88574C16.7715 8.05731 16.0999 7.38574 15.2715 7.38574Z" stroke="#1F1740" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.02148 11.8857H3.27148C2.87366 11.8857 2.49213 11.7277 2.21082 11.4464C1.92952 11.1651 1.77148 10.7836 1.77148 10.3857V3.63574C1.77148 3.23792 1.92952 2.85639 2.21082 2.57508C2.49213 2.29378 2.87366 2.13574 3.27148 2.13574H10.0215C10.4193 2.13574 10.8008 2.29378 11.0821 2.57508C11.3634 2.85639 11.5215 3.23792 11.5215 3.63574V4.38574" stroke="#1F1740" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)
