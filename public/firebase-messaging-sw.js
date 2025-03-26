// importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging.js");



importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: 'AIzaSyBdP1JXGjvxN62mqHR0fNmu_sqHCNb8fqw',
//   authDomain: "cohesive-amp-402814.firebaseapp.com",
//   projectId: "cohesive-amp-402814",
//   storageBucket: "cohesive-amp-402814.appspot.com",
//   messagingSenderId:"747367454232",
//   appId: "1:747367454232:web:ce5588c18e5fd9ae5c156d",
// });


console.log("Service Worker Loaded");

self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
});



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

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});

