// src/sw.ts
export {};
// @ts-ignore: ServiceWorkerGlobalScope is available in service worker context
declare const self: any;
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const app = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
});

const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
    console.log("Background message received:", payload);
  const n = (payload.notification as any) || (payload.data as any) || {};
  const title = n.title || "Notification";
  const body  = n.body;
  const icon  = n.icon || "/images/logosin.svg";
  const image = n.image;
  self.registration.showNotification(title, { body, icon, image });
});

self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});
