


importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// Configuration Firebase (à remplacer avec vos vraies valeurs)
const firebaseConfig = {
  apiKey: "AIzaSyBdP1JXGjvxN62mqHR0fNmu_sqHCNb8fqw",
  authDomain: "cohesive-amp-402814.firebaseapp.com",
  projectId: "cohesive-amp-402814",
  storageBucket: "cohesive-amp-402814.appspot.com",
  messagingSenderId: "747367454232",
  appId: "1:747367454232:web:ce5588c18e5fd9ae5c156d"
};


// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// let notificationCount = 0;


// console.log("Firebase messaging service worker loaded");

// // Gestion des messages en arrière-plan
// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message ', payload);

//   notificationCount = parseInt(payload.data?.count || notificationCount + 1);

//   self.clients.matchAll().then(clients => {
//     clients.forEach(client => {
//       client.postMessage({
//         type: 'NOTIFICATION_COUNT',
//         count: notificationCount
//       });
//     });
//   });

//   const notificationTitle = payload.notification?.title || 'Nouveau message';
//   const notificationOptions = {
//     body: payload.notification?.body,
//     icon: payload.notification?.icon || '/images/signin2.png',
//     vibrate: [200, 100, 200],
//     data: payload.data,
//       sound: '/sound/notification.mp3', // Son personnalisé
//     tag: 'new-notification'
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);

  
// });
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   const urlToOpen = event.notification.data?.url || `/chat/${data.shipmentId}`;
  
//   // Réinitialiser le compteur quand on clique
//   notificationCount = 0;
  
//   event.waitUntil(
//     clients.openWindow(urlToOpen).then(windowClient => {
//       windowClient.postMessage({
//         type: 'RESET_NOTIFICATION_COUNT'
//       });
//     })
//   );
// });

// // Gestion des messages entre le SW et les clients
// self.addEventListener('message', (event) => {
//   if (event.data.type === 'GET_NOTIFICATION_COUNT') {
//     event.ports[0].postMessage({
//       type: 'NOTIFICATION_COUNT',
//       count: notificationCount
//     });
//   }
// });
function playNotificationSound() {
  try {
    const audio = new Audio('/sound/notification');
    audio.play().catch(e => {
      console.error('Erreur de lecture du son:', e);
      // Fallback pour les navigateurs mobiles
      if (typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate([200, 100, 200]);
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'audio:', error);
  }
}

let notificationCount = 0;

// Fonction pour jouer le son dans le service worker
function playNotificationSound() {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'PLAY_NOTIFICATION_SOUND'
      });
    });
  });
}

// Gestion des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  // console.log('Received background message ', payload);

  notificationCount = parseInt(payload.data?.count || notificationCount + 1);

  // Mise à jour des clients ouverts
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_COUNT',
        count: notificationCount
      });
    });
  });

  const notificationTitle = payload.notification?.title || 'Nouveau message';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.icon || '/images/signin2.png',
    vibrate: [200, 100, 200],
    data: payload.data,
    sound:"sound/notification",
    tag: 'new-notification'
  };

  // Jouer le son
  playNotificationSound();

  return self.registration.showNotification(notificationTitle, notificationOptions);
});


// messaging.onBackgroundMessage((payload) => {
//   console.log("[SW] Notification BG:", payload);

//   const { title, body } = payload.notification || {};
//   const notificationOptions = {
//     body,
//     icon: "/images/signin1.png",
//     vibrate: [200, 100, 200],
//     tag: "new-notification",
//   };

//   self.registration.showNotification(title || "Notification", notificationOptions);
// });


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || `/chat/${event.notification.data?.shipmentId}`;
  
  // Réinitialiser le compteur
  notificationCount = 0;
  
  event.waitUntil(
    clients.openWindow(urlToOpen).then(windowClient => {
      windowClient.postMessage({
        type: 'RESET_NOTIFICATION_COUNT'
      });
    })
  );
});

// Gestion des messages entre le SW et les clients
self.addEventListener('message', (event) => {
  switch(event.data.type) {
    case 'GET_NOTIFICATION_COUNT':
      event.ports[0].postMessage({
        type: 'NOTIFICATION_COUNT',
        count: notificationCount
      });
      break;
      
    case 'PLAY_NOTIFICATION_SOUND':
      // Jouer le son dans le client
      const audio = new Audio('/sound/notification');
      audio.play().catch(e => console.error('Erreur lecture son:', e));
      break;
  }
});