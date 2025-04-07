'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';
import { BiSolidBell } from "react-icons/bi";
export const NotificationBadge = () => {
  const { count, resetCount } = useNotifications();

  // Jouer un son quand une nouvelle notification arrive
  useEffect(() => {
    if (count > 0) {
      const audio = new Audio('/sound/notification.mp3');
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
  }, [count]);

  return (
    <div className="relative">
      <button onClick={resetCount}>
        <BiSolidBell className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
    </div>
  );
};