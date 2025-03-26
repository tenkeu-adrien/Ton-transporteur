import { messaging } from "../../lib/firebaseConfig";
import { getToken } from "firebase/messaging";

const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
    console.log("Token:", token);
  }
};