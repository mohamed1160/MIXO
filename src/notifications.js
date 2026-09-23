import { getToken } from "firebase/messaging";
import { getFirebaseMessaging, VAPID_KEY } from "./firebase";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    throw new Error("Firebase Messaging is not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token;
}
