// // app/api/save-fcm-token/route.ts
// import { NextResponse } from 'next/server';
// import admin from 'firebase-admin';

// // Fonction d'initialisation séparée pour éviter les doublons
// function initializeFirebaseAdmin() {
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
// }

// export async function POST(request: Request) {
//   try {
//     // Initialiser Firebase Admin
//     const admin = initializeFirebaseAdmin();
//     const { token, userId } = await request.json();
//     // Validation des données
//     if (!token || !userId) {
//       return NextResponse.json(
//         { error: 'Token and userId are required' },
//         { status: 400 }
//       );
//     }

//     // Enregistrer le token dans Firestore
//     await admin.firestore().collection('users').doc(userId).update({
//       fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     return NextResponse.json(
//       { success: true, message: 'Token saved successfully' },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Error saving FCM token:', error);
//     return NextResponse.json(
//       { 
//         error: error.message || 'Failed to save token',
//         code: error.code || 'unknown-error'
//       },
//       { status: 500 }
//     );
//   }
// }


// app/api/save-fcm-token/route.ts
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Configuration améliorée avec timeout et retry
const firestoreSettings = {
  timeout: 120000, // 120 secondes de timeout
  retryOptions: {
    autoRetry: true,
    maxRetries: 3,
  },
};

// Fonction d'initialisation séparée avec gestion d'erreur améliorée
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
      
      // Appliquer les paramètres Firestore
      admin.firestore().settings(firestoreSettings);
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      throw new Error('Failed to initialize Firebase Admin');
    }
  }
  return admin;
}

// Fonction avec retry personnalisé
async function updateUserTokenWithRetry(userId: string, token: string, maxRetries = 3) {
  const admin = initializeFirebaseAdmin();
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);

  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await userRef.update({
        fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return; // Succès
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        // Attente exponentielle
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retry attempt ${attempt + 1} for userId: ${userId}`);
      }
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const { token, userId } = await request.json();
    
    // Validation améliorée
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Valid token is required' },
        { status: 400 }
      );
    }
    
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'Valid userId is required' },
        { status: 400 }
      );
    }

    // console.log(`Attempting to save FCM token for user: ${userId}`);
    
    // Utilisation de la fonction avec retry
    await updateUserTokenWithRetry(userId, token);
    
    // console.log(`Successfully saved FCM token for user: ${userId}`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Token saved successfully',
        userId,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving FCM token:', {
      error: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save token',
        message: error.message || 'Internal server error',
        code: error.code || 'internal-error',
        timestamp: new Date().toISOString()
      },
      { status: error.code === 'deadline-exceeded' ? 504 : 500 }
    );
  }
}