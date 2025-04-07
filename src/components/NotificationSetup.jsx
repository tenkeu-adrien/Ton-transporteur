'use client'
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getFcmToken } from '../../lib/firebaseNotifications';
import { AuthContext } from '../../context/AuthContext';
import { subscribeToMessages } from '../../lib/firebaseConfig';

export default function NotificationSetup() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const setupNotifications = async () => {
      if (!user?.uid) return;
      try {
        const token = await getFcmToken();
        const response = await fetch('/api/save-fcm-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, userId: user?.uid }),
        });
        //  console.log("response de  /api/save-fcm " ,response)
        // toast.success('Notifications activées!');
        const data = await response.json();
      if (!response.ok) {
        return {error:data.error}
      }else{
        return data
      }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(`Erreur: ${error.message}`);
      }
    };

    setupNotifications();
  }, [user]);


  // useEffect(() => {
  //   const unsubscribe = onMessageListener()
  //     .then((payload) => {
  //       const { title, body } = payload.notification;
        
  //       // Afficher une notification native si l'application est active
  //       if (document.visibilityState === 'visible') {
  //         new Notification(title, {
  //           body,
  //           icon: '/icon.png',
  //         });
  //       }
  //     })
  //     .catch((err) => console.log('failed: ', err));
  
  //   return () => unsubscribe;
  // }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((payload) => {
      const { title, body } = payload.notification;
  
      if (document.visibilityState === 'visible') {
        new Notification(title, {
          body,
          icon: '/icon.png',
        });
      }
  
      // ici tu peux aussi gérer l'ajout du message à l'état du chat si tu veux
    });
  
    return () => {
      unsubscribe(); // on nettoie proprement à la destruction du composant
    };
  }, []);
  return null;
}



