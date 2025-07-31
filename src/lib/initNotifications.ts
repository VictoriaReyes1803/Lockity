// src/lib/initNotifications.ts
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase-config";
import { onMessage } from "firebase/messaging";

import { notificationsregister, notificationsunregister } from "../services/logsService";

const TOKEN_KEY = "fcm_device_token";

const isElectron = () =>
  typeof window !== "undefined" && window.navigator.userAgent.includes("Electron");

export const setupForegroundNotificationHandler = (
  showNotification: (message: string, payload: any) => void
) => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    const { title, body } = payload.notification || {};
    const message = `${title ? `${title}: ` : ''}${body || ''}`;
    showNotification(message, payload);
  });
};


export const initNotifications = async () => {
  try {
   const registration = await navigator.serviceWorker.ready;

    console.log("Service worker registrado:", registration);

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!currentToken) {
      console.warn("No FCM token available");
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_KEY);
    console.log("Stored token:", storedToken);

    // Si el token cambió
    if (storedToken && storedToken !== currentToken) {
      await notificationsunregister(storedToken);
      await notificationsregister(currentToken);
      localStorage.setItem(TOKEN_KEY, currentToken);
    }

    // Si es nuevo
    if (!storedToken) {
      await notificationsregister(currentToken);
      localStorage.setItem(TOKEN_KEY, currentToken);
    }

    console.log("Token OK:", currentToken);
  } catch (error) {
    console.error("Error initializing notifications", error);
  }
};
