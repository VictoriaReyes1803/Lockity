// src/types/global.d.ts
export {};
import type { FCMNotificationPayload } from "./notifications";


declare global {
  interface Window {
    electronAPI?: {
      publishToggleCommand: (
        serialNumber: string,
        userId: number,
        compartmentNumber: number,
        valor: number,
        source: string
      ) => void;
       sendNotification: (n: { title?: string; body?: string; image?: string }) => void;
      subscribeToNotifications?: (args: { userId?: string | number; serial?: string }) => void;
      unsubscribe?: (topic: string) => void;
    };

    fcmDesktop?: {
      /** Token FCM emitido por electron-push-receiver */
      onRegistered?: (cb: (token: string) => void) => void;
      /** Notificación/payload recibido por electron-push-receiver */
      onNotification?: (cb: (payload: unknown) => void) => void;
      /** (Opcional) Recuperar token almacenado en main */
      getStoredToken?: () => Promise<string | undefined>;
    };
  }
}
