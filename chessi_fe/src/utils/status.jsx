import { useState, useEffect } from 'react';
import socket from './socket';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    socket.on("connect", async () => {
        setIsOnline(true);
    });

    socket.on("disconnect", async () => {
        setIsOnline(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 z-50">
      <div
        className={`px-4 py-2 rounded-tl-sm text-sm font-medium shadow-md transition-colors ${
          isOnline
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}
      >
        {isOnline ? 'Online' : 'Disconnected'}
      </div>
    </div>
  );
}
