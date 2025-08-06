// frontend/src/components/ui/BackendStatus.jsx
import React, { useState, useEffect } from 'react';

const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        setIsOnline(response.ok);
      } catch (error) {
        setIsOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-xs">Checking...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        Backend {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default BackendStatus;