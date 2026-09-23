import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD7KMLNwKd7j_Ox9Nj_n9pyT27lS-gpoPQ",
  authDomain: "mixo-3d.firebaseapp.com",
  projectId: "mixo-3d",
  storageBucket: "mixo-3d.firebasestorage.app",
  messagingSenderId: "558771404578",
  appId: "1:558771404578:web:fe7e5800786f2bd04f6f7b",
};

const app = initializeApp(firebaseConfig);

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  return getMessaging(app);
};

export const VAPID_KEY =
  "BBvLmv-e5-sBMuIa10D3S57H_OwNrV9v3o9cE2h9Be3FvT9cyn-mutWQAZ0FXQgjDRYbmaFO2HRcpgezdBljnUY";
