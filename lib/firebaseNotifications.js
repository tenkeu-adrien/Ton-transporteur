import { messaging } from "./firebase-config";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
      console.log("Token de notification FCM :", token);
      return token;
    } else {
      console.warn("Permission de notification refusée !");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
  }
};
