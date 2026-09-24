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
    payload.notification?.title || "MIXO 3D";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "You have a new notification.",
    icon: "/favicon.png",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
