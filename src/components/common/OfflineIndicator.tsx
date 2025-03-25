
import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-500 text-black z-50 transition-transform px-4 py-2 flex items-center justify-center text-sm font-medium">
      <WifiOff className="w-4 h-4 mr-2" />
      You're offline. Some features may be limited.
    </div>
  );
};

export default OfflineIndicator;
