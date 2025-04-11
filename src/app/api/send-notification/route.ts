// import admin from 'firebase-admin';
// import { NextResponse } from 'next/server';
// // Initialisation Firebase Admin
// const getFirebaseAdmin = () => {
//   if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//       }),
//     });
//   }
//   return admin;
// };



// const db = admin.firestore(); // Récupère l'instance Firestore

// async function removeTokenFromFirestore(token) {
//   try {
//     const usersRef = db.collection("users"); 
//     const snapshot = await usersRef.where("fcmTokens", "array-contains", token).get();

//     if (!snapshot.empty) {
//       snapshot.forEach(async (doc) => {
//         await usersRef.doc(doc.id).update({
//           fcmTokens: admin.firestore.FieldValue.arrayRemove(token) // Supprime uniquement ce token du tableau
//         });
//           return NextResponse.json(
//           { error:`✅ Token supprimé pour l'utilisateur: ${doc.id}` },
//           { status: 400 }
//         );
//       });
//     } else {
//       return NextResponse.json(
//         { error:"🔍 Aucun utilisateur trouvé avec ce token." },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error:"❌ Erreur lors de la suppression du token:" },
//       { status: 400 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   const admin = getFirebaseAdmin();

//   try {
//     const { userId, title, body, data } = await request.json();
// console.log("userId" , userId ,title ,body ,data)
//     // Validation des données
//     if (!userId) {
//       return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//     }

//     // Récupération du token FCM de l'utilisateur
//     const userDoc = await admin.firestore().collection("users").doc(userId).get();
//     const userData = userDoc.data();

//     // if (!userData?.fcmTokens?.length) {
//     //   return NextResponse.json({ error: "No FCM token found for this user" }, { status: 400 });
//     // }

//     const token = userData.fcmTokens[0];
//     const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/";

//     const message = {
//       token: token,
//       notification: {
//         title: title || "Nouvelle notification",
//         body: body || "Vous avez un nouveau message",
//       },
//       webpush: {
//         headers: {
//           Urgency: "high",
//           TTL: "86400", // 24h de durée de vie
//         },
//         notification: {
//           icon: `${BASE_URL}/images/signin1.png`,
//           badge: `${BASE_URL}/images/signin2.png`,
//           vibrate: [200, 100, 200, 100, 200],
//           requireInteraction: true,
//           sound: `${BASE_URL}/notification.mp3`,
//           actions: [
//             {
//               action: "open",
//               title: "Ouvrir",
//             },
//           ],
//         },
//         fcmOptions: {
//           link: `${BASE_URL}${data?.shipmetId || "/Accueil"}`,
//         },
//       },
//       data: {
//         ...data,
//         sent_time: new Date().toISOString(),
//       },
//     };

//     try {
//       await admin.messaging().send(message);
//       return NextResponse.json({ success: true });
//     } catch (error: any) {
//       if (error.code === "messaging/registration-token-not-registered") {
//         console.error("Le token FCM est invalide, suppression...");
//         await removeTokenFromFirestore(token);
//         return NextResponse.json({ error: "Token supprimé, notification non envoyée" }, { status: 400 });
//       }

//       console.error("Erreur d'envoi de la notification:", error);
//       return NextResponse.json({ error: "Erreur lors de l'envoi de la notification" }, { status: 500 });
//     }
//   } catch (error: any) {
//     console.error("Erreur générale:", error);
//     return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
//   }
  

 



// }

import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

// Initialisation Firebase Admin optimisée
const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return admin;
};

export async function POST(request: Request) {
  const admin = getFirebaseAdmin();
  const db = admin.firestore();

  try {
    const { userId, title, body, data } = await request.json();
    // console.log("Données reçues:", { userId, title, body, data });

    // Validation des données renforcée
    if (!userId) {
      return NextResponse.json(
        { error: "L'ID utilisateur est requis" },
        { status: 400 }
      );
    }

    // Récupération des données utilisateur
    const userDoc = await db.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Vérification des tokens FCM
    if (!userData?.fcmTokens || userData.fcmTokens.length === 0) {
      return NextResponse.json(
        { error: "Aucun token FCM trouvé pour cet utilisateur" },
        { status: 400 }
      );
    }

    const token = userData.fcmTokens[0];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Construction du message
    const message = {
      token: token,
      notification: {
        title: title || "Nouvelle notification",
        body: body || "Vous avez un nouveau message",
      },
      webpush: {
        headers: {
          Urgency: "high",
          TTL: "86400", // 24h de durée de vie
        },
        notification: {
          icon: `${BASE_URL}/images/logo/logo.png`,
          badge: `${BASE_URL}/images/logo/logo.png`,
          vibrate: [200, 100, 200, 100, 200],
          requireInteraction: true,
          sound: `${BASE_URL}sound/notification.mp3`,
          actions: [

            {
              action: "open",
              title: "Ouvrir",
            },
          ],
        },
        fcmOptions: {
          link: `${BASE_URL}${data?.shipmetId ? `/chat/${data.shipmetId}` : ""}`,
        },
      },
      data: {
        ...data,
        sent_time: new Date().toISOString(),
      },
    };

    // Fonction pour supprimer un token invalide
    const removeInvalidToken = async (token: string) => {
      try {
        await db.collection("users").doc(userId).update({
          fcmTokens: admin.firestore.FieldValue.arrayRemove(token)
        });
        // console.log(`Token supprimé pour l'utilisateur: ${userId}`);
      } catch (error) {
        // console.error("Erreur lors de la suppression du token:", error);
      }
    };

    // Envoi de la notification
    try {
   let result =   await admin.messaging().send(message);
      return NextResponse.json(
        { success: true, message: "Notification envoyée avec succès" ,result},
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Erreur d'envoi:", error);

      // Gestion des tokens invalides
      if (error.code === "messaging/registration-token-not-registered") {
        await removeInvalidToken(token);
        return NextResponse.json(
          { 
            error: "Token FCM invalide", 
            message: "Le token a été supprimé de la base de données" 
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: "Erreur lors de l'envoi de la notification",
          details: error.message 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Erreur générale:", error);
    return NextResponse.json(
      { 
        error: "Erreur serveur",
        message: error.message 
      },
      { status: 500 }
    );
  }
}