// importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging.js");



// importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");




// console.log("Service Worker Loaded");

// self.addEventListener("install", (event) => {
//   console.log("Service Worker Installed");
// });

// self.addEventListener("activate", (event) => {
//   console.log("Service Worker Activated");
// });



// const firebaseConfig = {
//     apiKey: 
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   };






// firebase.initializeApp({
//   apiKey: "VOTRE_API_KEY",
//   authDomain: "VOTRE_PROJET.firebaseapp.com",
//   projectId: "VOTRE_PROJECT_ID",
//   storageBucket: "VOTRE_PROJECT.appspot.com",
//   messagingSenderId: "VOTRE_SENDER_ID",
//   appId: "VOTRE_APP_ID",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: "/firebase-logo.png",
//   });
// });


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

let notificationCount = 0;


console.log("Firebase messaging service worker loaded");

// Gestion des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  notificationCount = parseInt(payload.data?.count || notificationCount + 1);

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
      sound: '/sound/notification.mp3', // Son personnalisé
    tag: 'new-notification'
  };
  console.log("notificationTitle message " ,notificationTitle)

  return self.registration.showNotification(notificationTitle, notificationOptions);

  
});



// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   const urlToOpen = event.notification.data?.url || '/';
  
//   event.waitUntil(
//     clients.openWindow(urlToOpen)
//   );
// });


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  
  // Réinitialiser le compteur quand on clique
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
  if (event.data.type === 'GET_NOTIFICATION_COUNT') {
    event.ports[0].postMessage({
      type: 'NOTIFICATION_COUNT',
      count: notificationCount
    });
  }
});


// self.addEventListener('message', (event) => {
//   if (event.data.type === 'GET_NOTIFICATION_COUNT') {
//     event.ports[0].postMessage({
//       type: 'NOTIFICATION_COUNT',
//       count: notificationCount
//     });
//   }
// });