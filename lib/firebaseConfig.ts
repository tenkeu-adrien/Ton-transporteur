// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// import { getMessaging, isSupported ,getToken, onMessage} from "firebase/messaging";
// // import { getMessaging,  } from "firebase/messaging";
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// // Vérifier si Firebase est déjà initialisé
// const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// // Initialisation des services
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);


// let messaging;
// if (typeof window !== "undefined" && "serviceWorker" in navigator) {
//   messaging = getMessaging(app);

//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("Service Worker enregistré avec succès:", registration);
//     })
//     .catch((error) => {
//       console.error("Erreur lors de l'enregistrement du Service Worker:", error);
//     });
// }


// export const googleProvider = new GoogleAuthProvider();

// export { auth, db, messaging ,storage, getToken ,onMessage};

import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialisation Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
let messaging = null;

// Initialisation conditionnelle de Messaging
if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
    
    // Enregistrement du Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
          // console.log('Service Worker registered with scope:', registration.scope);
          console.log('');

        })
        .catch(error => {
          console.error('');
          // console.error('Service Worker registration failed:', error);

        });
    }
  } catch (err) {
    // console.error('Messaging initialization error:', err);
    console.error('');

  }
}

/**
 * Récupère le token FCM et l'envoie au backend
 */
export const getAndSendFCMToken = async (userId) => {
  if (!messaging) {
    // console.warn('Messaging not available');
    return null;
  }

  try {
    const token = await getToken(messaging, { 
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
    });

    if (token) {
      // console.log('FCM Token:', token);
      
      // Envoi du token au backend
      await sendTokenToBackend(token, userId);
      
      return token;
    } else {
      // console.log('No registration token available. Request permission first.');
      return null;
    }
  } catch (error) {
    // console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

/**
 * Envoie le token FCM au backend
 */
const sendTokenToBackend = async (token, userId) => {
  try {
    const response = await fetch('/api/save-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        userId
      }),
    });

    if (!response.ok) {
      // throw new Error('Failed to save token');
      return null
    }

    // console.log('Token saved successfully');
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
};

/**
 * Écoute les messages en foreground
 */
export const onForegroundMessage = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export const subscribeToMessages = (callback: (payload: any) => void) => {
  const unsubscribe = onMessage(messaging, callback);
  return unsubscribe; // très important pour le cleanup
};

export { 
  auth, 
  db, 
  messaging, 
  storage, 
  googleProvider 
};
