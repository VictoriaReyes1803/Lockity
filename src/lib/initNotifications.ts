// src/lib/initNotifications.ts
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase-config";
import { onMessage } from "firebase/messaging";
import type { FCMNotificationPayload } from "../types/notification";

import { notificationsregister, notificationsunregister } from "../services/logsService";

const TOKEN_KEY = "fcm_device_token";
type NotificationPayload = {
  title?: string;
  body?: string;
  image?: string;
  icon?: string;
};

const isElectron = () =>
  typeof window !== "undefined" && window.navigator.userAgent.includes("Electron");

export const setupForegroundNotificationHandler = (
  showNotification: (message: string, payload: FCMNotificationPayload) => void
) => {
  onMessage(messaging, (payload) => {
    const n = payload.notification || {};
    console.log("Foreground message received:", payload);
    if (isElectron() && window.electronAPI?.sendNotification) {
     window.electronAPI.sendNotification({
        title: n.title ?? "Lockity",
        body: n.body ?? "",
        image: (n as any).image,
      });
      return;
    } else {
      const { title, body } = payload.notification || {};
      const message = `${title ? `${title}: ` : ''}${body || ''}`;
      showNotification(message, payload);
    }
  });
};


export const initNotifications = async () => {
 

  try {
    if (isElectron()) {
      console.warn("[FCM] Electron detectado: Web Push no disponible. Usa el canal nativo.");
      return;
    }
    if (!('Notification' in window)) return;
      if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if ("Notification" in window && Notification.permission !== "granted") {
      console.warn("❌ Notificaciones no permitidas:", Notification.permission);
      return;
    }

  let registration: ServiceWorkerRegistration;

    if (import.meta.env.DEV) {
      // URL a tu SW ESM en src/ (Vite lo sirve transformado)
      const swUrl = '/dev-fcm-sw.ts';
      // registra como módulo para permitir imports ESM dentro del SW
      registration =
        (await navigator.serviceWorker.getRegistration(swUrl)) ||
        (await navigator.serviceWorker.register(swUrl, { type: 'module', scope: '/' }));

      // Asegura que el SW tome control
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        location.reload();
        return;
      }
    } else {
      // En prod el PWA (injectManifest) ya habrá registrado /sw.js
      registration = await navigator.serviceWorker.ready;
    }

    console.log("Service worker listo:", registration?.active?.scriptURL);


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
