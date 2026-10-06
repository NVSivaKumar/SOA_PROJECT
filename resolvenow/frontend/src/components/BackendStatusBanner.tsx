import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const BackendStatusBanner: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const checkStatus = () => {
    fetch('http://localhost:8080/api/auth/health')
      .then((res) => {
        if (res.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      })
      .catch(() => {
        setStatus('offline');
      });
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">


      {status === 'offline' && (
        <div className="bg-background border-b border-gold-bronze text-gold-bright text-xs font-mono font-semibold px-4 py-2 flex items-center justify-center space-x-2 shadow-sm">
          <WifiOff className="w-4 h-4" />
          <span>Backend Server is offline or unreachable (Gateway: http://localhost:8080)</span>
        </div>
      )}
    </div>
  );
};

export default BackendStatusBanner;
