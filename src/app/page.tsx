"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Loader from "@/components/Loader";
import { app, firebaseConfig } from "../../lib/firebaseConfig";
import { getMessaging, onMessage } from 'firebase/messaging';
import { playNotificationSound } from "../../lib/functions";
export default function Home() {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);

  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/firebase-messaging-sw.js')
  //       .then(registration => {
  //         console.log('Service Worker enregistré:', registration);
  //       })
  //       .catch(error => {
  //         console.error('Erreur d’enregistrement SW:', error);
  //       });
  //   }
  // }, []);

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const messaging = getMessaging(app);
      
      // Gestion des notifications en premier plan
      const unsubscribe = onMessage(messaging, (payload) => {
        // console.log('Message reçu en premier plan:', payload);
        
        // Mettre à jour le compteur de notifications
        // const newCount = parseInt(payload.data?.count || 0);
        // setNotificationCount(newCount); // Si vous utilisez un state
        
        // Afficher une notification
        if (Notification.permission === 'granted') {
          const notificationTitle = payload.notification?.title || 'Nouveau message';
          const notificationOptions = {
            body: payload.notification?.body,
            icon: payload.notification?.icon || '/images/signin2.png',
            vibrate: [200, 100, 200],
            data: payload.data,
            sound: '/sound/notification',
            tag: 'new-notification'
          };
          
          new Notification(notificationTitle, notificationOptions);
          
          // Jouer le son
          playNotificationSound();
        }
      });
      
      return () => unsubscribe();
    }
  }, []);
  useEffect(() => {
    NProgress.start();

    // Timer pour le loader (5 secondes)
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    // Redirection après 5 secondes
    const redirectTimer = setTimeout(() => {
      router.push("/Accueil");
      NProgress.done();
    }, 500);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(redirectTimer);
      NProgress.done();
    };
  }, [router]);
  
  useEffect(() => {
    if ('serviceWorker' in navigator && firebaseConfig) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
          // console.log('SW registered');
        })
        .catch(err => {
          // console.log('SW registration failed:', err);
        });
    }
  }, []);

  if (showLoader) {
    return <Loader />
      
  }

  return null;
}