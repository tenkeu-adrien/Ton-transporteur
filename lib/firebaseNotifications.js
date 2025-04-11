// import { messaging } from "../lib/firebaseConfig";
// import { getToken, onMessage } from "firebase/messaging";

// export const getFcmToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === "granted") {
//       const registration = await navigator.serviceWorker.ready;
//       const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY  ,serviceWorkerRegistration: registration});
//       // console.log("Token de notification FCM :", token);
//       return token;
//     } else {
//       console.warn("Permission de notification refusée !");
//     }
//   } catch (error) {
//     console.error("Erreur lors de la récupération du token :", error);
//   }
// };

// export const setupMessageListener = (callback) => {
//   try {
//     return onMessage(messaging, (payload) => {
//       console.log("Message reçu (premier plan):", payload);
      
//       // Afficher une notification toast
//       if (payload.notification) {
//         toast.info(payload.notification.body, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//       }
      
//       // Exécuter le callback personnalisé
//       if (callback) callback(payload);
//     });
//   } catch (error) {
//     console.error("Erreur lors de la configuration de l'écouteur:", error);
//   }
// };

// // Fonction pour gérer les clics sur les notifications
// export const handleNotificationClick = (payload) => {
//   if (payload.data) {
//     // Navigation selon le type de notification
//     if (payload.data.shipmentId) {
//       window.location.href = `/shipments/${payload.data.shipmentId}`;
//     } else if (payload.data.chatId) {
//       window.location.href = `/messages/${payload.data.chatId}`;
//     }
//   }
// };

import { messaging } from "../lib/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

export const getFcmToken = async () => {
  try {
    if (Notification.permission === "denied") {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.ready;
    return await getToken(messaging, { 
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });
  } catch (error) {
    return null;
  }
};

export const setupMessageListener = (callback) => {
  try {
    return onMessage(messaging, (payload) => {
      if (payload.notification && Notification.permission === "granted") {
        // Ne crée une notification que si l'application est en arrière-plan
        if (document.visibilityState !== 'visible') {
          new Notification(payload.notification.title || "Nouvelle notification", {
            body: payload.notification.body,
            icon: '/icon.png',
            data: payload.data
          }).onclick = () => callback(payload);
        }
        // Pour le premier plan, le callback est appelé directement
        else if (callback) {
          callback(payload);
        }
      }
    });
  } catch (error) {
    return () => {};
  }
};

export const handleNotificationClick = (payload) => {
  if (!payload.data) return;

  const { shipmentId, chatId } = payload.data;
  if (shipmentId) {
    window.location.href = `/shipments/${shipmentId}`;
  } else if (chatId) {
    window.location.href = `/messages/${chatId}`;
  }
};