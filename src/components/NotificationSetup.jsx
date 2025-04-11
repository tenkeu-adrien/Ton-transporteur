'use client'
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFcmToken, handleNotificationClick, setupMessageListener } from '../../lib/firebaseNotifications';
import { AuthContext } from '../../context/AuthContext';

export default function NotificationSetup() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const setupNotifications = async () => {
      if (!user?.uid) return;
      
      try {
        const token = await getFcmToken();
        if (!token) return;

        const response = await fetch('/api/save-fcm-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, userId: user.uid }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          // throw new Error(errorData.error || "Erreur lors de l'enregistrement");
          return null
        }

        // toast.success('Notifications activées!');
        return null
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(`Erreur: ${error.message}`);
      }
    };

    setupNotifications();
  }, [user]);


  
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = setupMessageListener((payload) => {
      if (Notification.permission === "granted" && document.visibilityState === 'visible') {
        new Notification(payload.notification?.title || "Nouvelle notification", {
          body: payload.notification?.body,
          icon: '/icon.png',
          data: payload.data
        }).onclick = () => handleNotificationClick(payload);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return null;
}