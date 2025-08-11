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
       sendNotification: (notification: FCMNotificationPayload["notification"]) => void;
    };
  }
}
