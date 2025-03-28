// import * as functions from 'firebase-functions';
// // import * as admin from 'firebase-admin';
// // import Stripe from 'stripe';

// // import {stripe} from '../../../../../../'

// // import { onRequest } from "firebase-functions/v2/https";

// // admin.initializeApp();

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);




// exports.helloWorld = functions.https.onRequest((req, res) => {
//     res.status(200).send("Hello, World! djeudje tenkeu adrien kevin ");
//   });

//   // const functions = require("firebase-functions");
//   const admin = require("firebase-admin");
//   admin.initializeApp();
  
//   exports.sendNotificationToAdmin = functions.firestore
//     .onDocumentCreated("notifications/{notificationId}")
//     .onCreate(async (snapshot, context) => {
//       const notification = snapshot.data();
  
//       // Récupérer le token FCM de l'administrateur
//       const adminDoc = await admin.firestore().collection("users").doc("ADMIN_UID").get();
//       const adminData = adminDoc.data();
//       const adminFcmToken = adminData.fcmToken;
  
//       if (!adminFcmToken) {
//         console.warn("Aucun token FCM trouvé pour l'administrateur");
//         return;
//       }
  
//       // Envoyer une notification push
//       const message = {
//         token: adminFcmToken,
//         notification: {
//           title: "Nouveau colis disponible",
//           body: notification.message,
//         },
//         data: {
//           expeditionId: notification.expeditionId,
//           expediteurId: notification.expediteurId,
//         },
//       };
  
//       try {
//         await admin.messaging().send(message);
//         console.log("Notification push envoyée à l'administrateur");
//       } catch (error) {
//         console.error("Erreur lors de l'envoi de la notification : ", error);
//       }
//     });




// // export const createCheckoutSession = functions.https.onRequest(async (req, res) => {
// //   if (req.method !== 'POST') {
// //     res.status(405).send('Method Not Allowed');
// //     return;
// //   }

// //   const { amount, currency, description } = req.body;

// //   try {
// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ['card'],
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: currency || 'eur',
// //             product_data: {
// //               name: "Frais d'expédition",
// //               description: description || 'Expédition de colis',
// //             },
// //             unit_amount: amount, // Montant en cents
// //           },
// //           quantity: 1,
// //         },
// //       ],
// //       mode: 'payment',
// //       success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
// //       cancel_url: `${req.headers.origin}/cancel`,
// //     });

// //     res.json({ id: session.id });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Stripe error: ' + error.message });
// //   }
// // });




// // export const stripeWebhook = functions.https.onRequest(async (req, res) => {
// //   const sig = req.headers['stripe-signature'];
// //   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// //   let event;

// //   try {
// //     event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
// //   } catch (err) {
// //     res.status(400).send(`Webhook Error: ${err.message}`);
// //     return;
// //   }

// //   if (event.type === 'checkout.session.completed') {
// //     const session = event.data.object;
// //     await admin.firestore().collection('paiements').doc(session.id).set({
// //       amount: session.amount_total / 100, // Convertir en euros
// //       currency: session.currency,
// //       status: 'completed',
// //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
// //     });

// //     console.log(`Paiement réussi : ${session.id}`);
// //   }

// //   res.json({ received: true });
// // });