/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Vite reads this
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Raised from outside React — see `NotificationContainer`, which registers it. */
interface AppNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

declare global {
  interface Window {
    /**
     * Registered by the notification container while it is mounted. The API
     * layer and the auth context call it from outside the component tree.
     */
    showNotification?: (notification: AppNotification) => void;
  }
}

export {};
