// src/types/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI?: {
      publishToggleCommand: (
        serialNumber: string,
        userId: number,
        compartmentNumber: number
      ) => void;
    };
  }
}
