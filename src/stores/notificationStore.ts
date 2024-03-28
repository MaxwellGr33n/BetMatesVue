// src/stores/notificationStore.ts
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore({
 id: 'notification',
 state: () => ({
    isOpen: false,
 }),
 actions: {
    openNotification() {
      this.isOpen = true;
    },
    closeNotification() {
      this.isOpen = false;
    },
 },
});