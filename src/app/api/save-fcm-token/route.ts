// app/api/save-fcm-token/route.ts
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Fonction d'initialisation séparée pour éviter les doublons
function initializeFirebaseAdmin() {
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
}

export async function POST(request: Request) {
  try {
    // Initialiser Firebase Admin
    const admin = initializeFirebaseAdmin();
    const { token, userId } = await request.json();
    // Validation des données
    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Token and userId are required' },
        { status: 400 }
      );
    }

    // Enregistrer le token dans Firestore
    await admin.firestore().collection('users').doc(userId).update({
      fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, message: 'Token saved successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to save token',
        code: error.code || 'unknown-error'
      },
      { status: 500 }
    );
  }
}