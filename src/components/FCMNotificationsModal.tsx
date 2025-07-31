// src/components/FCMNotificationModal.tsx
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

export interface FCMNotificationPayload {
  title: string;
  body: string;
  image?: string;
}
interface Props {
  payload: FCMNotificationPayload | null;
  visible: boolean;
  onHide: () => void;
}

export default function FCMNotificationModal({
  payload,
  visible,
  onHide,
}: Props) {
  return (
    <Dialog
      header={payload?.title}
      visible={visible}
      onHide={onHide}
      dismissableMask
      style={{ width: '30vw' }}
      className="rounded-xl shadow-lg"
    >
      <div className="flex flex-col items-center gap-3">
        {payload?.image && (
          <img
            src={payload?.image}
            alt="Notification"
            className="w-full max-h-64 object-contain rounded"
          />
        )}
        <p className="text-center text-white">{payload?.body}</p>
      </div>
    </Dialog>
  );
}
