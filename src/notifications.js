import React from "react";
import { getToken, onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
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

export async function setupForegroundNotifications(navigate) {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    return onMessage(messaging, (payload) => {
      console.log("Foreground notification received:", payload);
      const title = payload.notification?.title || payload.data?.title || "طلب جديد 🛒";
      const body = payload.notification?.body || payload.data?.body || "تم استلام طلب جديد";
      const orderId = payload.data?.order_id || payload.data?.orderId;
      const targetUrl = payload.data?.url || (orderId ? `/admin/orders/${orderId}` : "/admin/orders");

      toast((t) => (
        React.createElement("div", {
          className: "flex flex-col gap-1 cursor-pointer p-1 text-right dir-rtl",
          onClick: () => {
            toast.dismiss(t.id);
            if (navigate) {
              navigate(targetUrl);
            } else {
              window.location.href = targetUrl;
            }
          }
        }, [
          React.createElement("span", { key: "title", className: "font-bold text-sm text-[#FF1F3D]" }, title),
          React.createElement("span", { key: "body", className: "text-xs text-gray-700 dark:text-gray-200" }, body),
          React.createElement("span", { key: "link", className: "text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1 underline" }, "اضغط هنا لفتح تفاصيل الطلب مباشرة ←")
        ])
      ), {
        duration: 10000,
        position: 'top-right',
      });
    });
  } catch (err) {
    console.warn("Foreground notification setup skipped:", err);
  }
}
