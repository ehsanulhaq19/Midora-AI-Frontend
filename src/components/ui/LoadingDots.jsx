// src/components/ui/LoadingDots.jsx
import React from 'react';

const LoadingDots = ({ size = 'md', color = 'gray' }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    white: 'bg-white',
    black: 'bg-black'
  };

  const dotClass = `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`;

  return (
    <div className="flex items-center space-x-1">
      <div
        className={dotClass}
        style={{
          animationDelay: '0ms',
          animationDuration: '1400ms'
        }}
      ></div>
      <div
        className={dotClass}
        style={{
          animationDelay: '160ms',
          animationDuration: '1400ms'
        }}
      ></div>
      <div
        className={dotClass}
        style={{
          animationDelay: '320ms',
          animationDuration: '1400ms'
        }}
      ></div>
    </div>
  );
};

export default LoadingDots;