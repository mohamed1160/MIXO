importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD7KMLNwKd7j_Ox9Nj_n9pyT27lS-gpoPQ",
  authDomain: "mixo-3d.firebaseapp.com",
  projectId: "mixo-3d",
  storageBucket: "mixo-3d.firebasestorage.app",
  messagingSenderId: "558771404578",
  appId: "1:558771404578:web:fe7e5800786f2bd04f6f7b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle =
    payload.notification?.title || payload.data?.title || "MIXO 3D";

  const notificationBody =
    payload.notification?.body || payload.data?.body || "You have a new notification.";

  const orderId = payload.data?.order_id || payload.data?.orderId;
  const targetUrl =
    payload.data?.url ||
    (orderId ? `/admin/orders/${orderId}` : "/admin/orders");

  const notificationOptions = {
    body: notificationBody,
    icon: "/favicon.png",
    badge: "/favicon.png",
    data: {
      url: targetUrl,
      orderId: orderId,
    },
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click:", event);
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/admin/orders";
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus and navigate any open tab belonging to our site
        for (const client of clientList) {
          if (client.url && client.url.startsWith(self.location.origin) && "focus" in client) {
            client.focus();
            if ("navigate" in client) {
              return client.navigate(absoluteUrl);
            }
            return;
          }
        }
        // If all tabs were closed, open a new window
        if (clients.openWindow) {
          return clients.openWindow(absoluteUrl);
        }
      })
  );
});
