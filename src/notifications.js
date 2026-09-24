import { getToken } from "firebase/messaging";
import { getFirebaseMessaging, VAPID_KEY } from "./firebase";
import { supabase } from "./services/supabaseClient";
import { useAuthStore } from "./store/useAuthStore";

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

  if (!registration.active) {
    await navigator.serviceWorker.ready;
  }

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Failed to generate FCM token.");
  }

  // Get current custom MIXO user
  const user = useAuthStore.getState().user;

  const userId = user?.id ?? null;

  // Save token in Supabase
  const { error } = await supabase
    .from("push_tokens")
    .upsert(
      {
        token,
        user_id: userId,
        platform: "web",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "token",
      }
    );

  if (error) {
    console.error("Failed to save FCM token:", error);
    throw error;
  }

  console.log("✅ FCM token saved to Supabase");

  return token;
}
