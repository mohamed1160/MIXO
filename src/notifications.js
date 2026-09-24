import { getToken } from "firebase/messaging";
import { getFirebaseMessaging, VAPID_KEY } from "./firebase";
import { supabase } from "./services/supabaseClient";
import { useAuthStore } from "./store/useAuthStore";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  // Web Push on iPhone/iPad requires an installed Home Screen web app.
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isIOS && !isStandalone) {
    console.warn(
      "On iPhone/iPad, the website must be added to the Home Screen before enabling notifications."
    );
    return null;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Notification permission:", permission);
    return null;
  }

  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    throw new Error("Firebase Messaging is not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  await navigator.serviceWorker.ready;

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Failed to generate FCM token.");
  }

  const user = useAuthStore.getState().user;
  const userId = user?.id ?? null;

  if (!userId) {
    console.warn("No logged-in user found. FCM token was not saved.");
    return token;
  }

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

  console.log("✅ FCM token saved to Supabase for:", userId);

  return token;
}
