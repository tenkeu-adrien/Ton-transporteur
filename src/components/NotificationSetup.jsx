'use client'
import { useContext, useEffect, useState } from 'react';
import { getFcmToken, handleNotificationClick, setupMessageListener } from '../../lib/firebaseNotifications';
import { AuthContext } from '../../context/AuthContext';

export default function NotificationSetup() {
  const { user } = useContext(AuthContext);
  const [tokenSaved, setTokenSaved] = useState(false);

  useEffect(() => {
    if (!user?.uid || tokenSaved) return;

    const setupNotifications = async () => {
      try {
        const token = await getFcmToken();
        if (!token) return;

        const response = await fetch('/api/save-fcm-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, userId: user.uid }),
        });

        if (response.ok) {
          setTokenSaved(true);
        }
      } catch (error) {
        console.error('Erreur de configuration des notifications:', error);
      }
    };

    setupNotifications();
  }, [user, tokenSaved]);

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