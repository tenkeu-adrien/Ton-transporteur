import { useEffect, useState } from 'react';

export const useNotifications = () => {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('MessageChannel' in window)) {
      console.warn('Service Worker ou MessageChannel non supporté');
      return;
    }

    const handleControllerChange = () => {
      if (navigator.serviceWorker.controller) {
        setIsReady(true);
      }
    };

    // Vérifier si le contrôleur est déjà disponible
    if (navigator.serviceWorker.controller) {
      setIsReady(true);
    }

    // Écouter les changements de contrôleur
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const channel = new MessageChannel();
    
    channel.port1.onmessage = (event) => {
      if (event.data.type === 'NOTIFICATION_COUNT') {
        setCount(event.data.count);
      }
    };

    // Envoyer le message uniquement quand le contrôleur est prêt
    navigator.serviceWorker.controller?.postMessage(
      { type: 'GET_NOTIFICATION_COUNT' },
      [channel.port2]
    );

    // Écouter les nouvelles notifications
    const handleMessage = (event) => {
      if (event.data.type === 'NEW_NOTIFICATION') {
        setNotifications(prev => [...prev, event.data.notification]);
        setCount(prev => prev + 1);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      channel.port1.close();
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [isReady]);

  const resetCount = () => {
    setCount(0);
    navigator.serviceWorker.controller?.postMessage({
      type: 'RESET_NOTIFICATION_COUNT'
    });
  };

  return { count, notifications, resetCount };
};