export type FCMNotificationPayload = {
  notification?: {
    title?: string;
    body?: string;
    image?: string;
    icon?: string;
  };
  data?: {
    action?: string;
    compartmentNumber?: string;
    image_url?: string;
    lockerId?: string;
    serialNumber?: string;
    type?: string;
    [key: string]: string | undefined;
  };
  from?: string;
  messageId?: string;
};
