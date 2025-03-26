import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { db } from '../../../../lib/firebaseConfig';

export async function POST(req: Request) {
  try {
    const {title, body, type, data ,fcmToken} = await req.json();

    // Récupérer le token FCM de l'utilisateur
    // const userDoc = await db.collection('users').doc(userId).get();
  

    // Envoyer la notification
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        type,
        ...data,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la notification' },
      { status: 500 }
    );
  }
} 