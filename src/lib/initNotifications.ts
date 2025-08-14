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


async function initWebFCM() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission !== "granted") {
    console.warn("[FCM/Web] Permiso denegado");
    return;
  }

  // Si en dev registras un SW ESM, pásalo aquí; en prod `ready` del PWA
  let registration: ServiceWorkerRegistration | undefined;
  try {
    if (import.meta.env.DEV) {
      const swUrl = "/dev-fcm-sw.ts";
      registration =
        (await navigator.serviceWorker.getRegistration(swUrl)) ||
        (await navigator.serviceWorker.register(swUrl, { type: "module", scope: "/" }));
      await navigator.serviceWorker.ready;
    } else {
      registration = await navigator.serviceWorker.ready;
    }
    console.log("[FCM/Web] SW:", registration?.active?.scriptURL);
  } catch (e) {
    console.warn("[FCM/Web] No se pudo registrar SW (seguimos sin background):", e);
  }

  const vapid = import.meta.env.VITE_VAPID_KEY as string | undefined;
  if (!vapid) {
    console.warn("[FCM/Web] Falta VITE_VAPID_KEY");
    return;
  }

  const token = await getToken(messaging, {
    vapidKey: vapid,
    serviceWorkerRegistration: registration, // puede ser undefined si no hay SW
  });

  if (!token) {
    console.warn("[FCM/Web] No se obtuvo token");
    return;
  }

  const prev = localStorage.getItem(TOKEN_KEY);
  if (prev && prev !== token) {
    await notificationsunregister(prev);
    await notificationsregister(token);
  } else if (!prev) {
    await notificationsregister(token);
  }
  localStorage.setItem(TOKEN_KEY, token);
  console.log("[FCM/Web] Token:", token.slice(0, 16) + "…");

  // Foreground (solo navegador)
  onMessage(messaging, (payload) => {
    const n = payload.notification || (payload as any).data || {};
    const title = n.title ?? "Lockity";
    const body = n.body ?? "";
    const image = n.image;
    // Muestra tu UI (modal/toast web)
    new Notification(title, { body, icon: image || "/images/logosin.svg" });
  });
}

// --- Solo para Electron (usa electron-push-receiver) ---
function initElectronFCM() {
  console.log("[FCM/Electron] Escuchando eventos del push receiver…");

  // Estos listeners vienen “expuestos” por el preload.
  // En tu preload.cjs:
  // contextBridge.exposeInMainWorld('fcmDesktop', {
  //   onRegistered: (cb) => ipcRenderer.on('push-receiver-registered', (_e, t) => cb(t)),
  //   onNotification: (cb) => ipcRenderer.on('push-receiver-notification', (_e, n) => cb(n)),
  //   getStoredToken: () => ipcRenderer.invoke('getFCMToken'),
  // });

  window.fcmDesktop?.onRegistered?.(async (token: string) => {
    console.log("[FCM/Electron] Token:", token);
    // Si quieres que tu backend pueda enviar a este desktop, regístralo:
    try {
      await notificationsregister(token);
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn("[FCM/Electron] No se pudo registrar token en backend:", e);
    }
  });

  window.fcmDesktop?.onNotification?.((payload: any) => {
    // El receiver te entrega algo similar a FCM web:
    const n = payload?.notification ?? payload?.data ?? payload ?? {};
    const title = n.title ?? "Lockity";
    const body = n.body ?? "";
    const image = n.image;

    // Muestra notificación nativa (puente ya expuesto en preload)
    window.electronAPI?.sendNotification?.({ title, body, image });
  });
}

// --- API única que llamas desde tu App ---
export async function initNotifications() {
  if (isElectron()) {
    // Desktop (Electron): NO uses getToken() web; escucha los eventos del receiver
    initElectronFCM();
  } else {
    // Navegador: FCM Web normal
    await initWebFCM();
  }
}