<template>
  <div class="bg-neutral-100 p-[50px] max-w-5/6 rounded-lg">
    <h2 class="text-2xl pb-4">{{ title }}</h2>
    <p class="text-lg">{{ msg }}</p>
    <div class="flex items-center justify-between mt-10">
      <button
        class="bg-white hover:bg-neutral-50 text-sm font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
        @click="notificationStore.closeNotification"
      >
        Close
      </button>

      <RouterLink class="bg-white hover:bg-neutral-50 text-sm font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline" to="/betslip"
        >Betslip</RouterLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { RouterLink } from "vue-router";
import { useNotificationStore } from "@/stores/notificationStore";

const notificationStore = useNotificationStore();

defineProps({
  title: String,
  msg: String,
});
</script>

<style scoped></style>
