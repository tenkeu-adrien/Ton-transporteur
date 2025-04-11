// import { useEffect, useState } from "react";
// import { messaging, getToken, onMessage } from "../../lib/firebaseConfig";

// export default function FCMSetup() {
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/firebase-messaging-sw.js")
//         .then((registration) => console.log("Service Worker enregistré !"))
//         .catch((err) => console.error("Erreur SW", err));
//     }

//     // Demander la permission pour recevoir des notifications
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         getToken(messaging, { vapidKey: "BDl0LAvQdLfwRiaTd_lP52yY3UK_k_aWG0-S2Tt-7Qej2buZXKaEc-pHFEAw2tHgpLMyUjAYNldPgIRI5RckkJY" })
//           .then((currentToken) => {
//             if (currentToken) {
//               console.log("FCM Token:", currentToken);
//               setToken(currentToken);
//             } else {
//               console.warn("Pas de token disponible.");
//             }
//           })
//           .catch((err) => console.error("Erreur lors de la récupération du token", err));
//       }
//     });

//     // Gérer les notifications en premier plan
//     onMessage(messaging, (payload) => {
//       console.log("Notification reçue en premier plan:", payload);
//       alert(payload.notification.title + ": " + payload.notification.body);
//     });
//   }, []);

//   return <div>FCM actif ! Token : {token}</div>;
// }





"use client"; // Assure l'exécution uniquement côté client

import { useEffect, useState } from "react";
import { messaging } from "../../lib/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

export default function FCMSetup() {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!messaging) {
      // console.warn("Firebase Messaging indisponible côté serveur.");
      return;
    }

    // Enregistrer le Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("Service Worker enregistré !"))
        .catch((err) => console.error("Erreur SW", err));
    }

    // Demander la permission pour recevoir des notifications
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey: "BDl0LAvQdLfwRiaTd_lP52yY3UK_k_aWG0-S2Tt-7Qej2buZXKaEc-pHFEAw2tHgpLMyUjAYNldPgIRI5RckkJY",
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              setToken(currentToken);
            } else {
              // console.warn("Pas de token disponible.");
            }
          })
          .catch((err) => console.error("Erreur lors de la récupération du token", err));
      }
    });

    // Vérifier si `onMessage` est bien défini
    if (typeof onMessage === "function") {
      onMessage(messaging, (payload) => {
        // console.log("Notification reçue en premier plan:", payload);
        // alert(payload.notification.title + ": " + payload.notification.body);
      });
    }
  }, []);

  return <div>FCM actif ! Token : {token}</div>;
}

