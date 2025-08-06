// src/components/ResponsiveTest.jsx
import React, { useState, useEffect } from 'react';

const ResponsiveTest = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = (width) => {
    if (width < 640) return 'Mobile (< 640px)';
    if (width < 768) return 'SM (640px - 768px)';
    if (width < 1024) return 'MD (768px - 1024px)';
    if (width < 1280) return 'LG (1024px - 1280px)';
    if (width < 1536) return 'XL (1280px - 1536px)';
    return '2XL (> 1536px)';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-xs font-mono">
        <div className="mb-1">
          <strong>Screen:</strong> {screenSize.width} x {screenSize.height}
        </div>
        <div className="mb-1">
          <strong>Breakpoint:</strong> {getBreakpoint(screenSize.width)}
        </div>
        <div className="flex space-x-2 mt-2">
          <div className="block sm:hidden bg-red-500 px-2 py-1 rounded text-xs">XS</div>
          <div className="hidden sm:block md:hidden bg-yellow-500 px-2 py-1 rounded text-xs">SM</div>
          <div className="hidden md:block lg:hidden bg-green-500 px-2 py-1 rounded text-xs">MD</div>
          <div className="hidden lg:block xl:hidden bg-blue-500 px-2 py-1 rounded text-xs">LG</div>
          <div className="hidden xl:block 2xl:hidden bg-purple-500 px-2 py-1 rounded text-xs">XL</div>
          <div className="hidden 2xl:block bg-pink-500 px-2 py-1 rounded text-xs">2XL</div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest;