<template>
  <div class="pt-12"></div>
  <nav class="flex justify-center fixed bottom-0 bg-neutral-50 h-12 w-screen shadow-[rgba(0,0,10,0.1)_0px_-0.5px_6px_0px]">
    <div class="flex justify-between items-center w-screen sm:w-4/5 max-w-screen-lg">
      <ul class="flex w-full h-full">
        <li v-for="item in quickLinks" :key="item.id" class="w-1/4 h-full">
          <a
            @click="toggleActive(item)"
            :class="['flex flex-col items-center justify-center w-full h-full', item.active ? 'bg-neutral-200 shadow-inner' : 'bg-neutral-50']"
          >
            <span class="flex items-center">
              <Icon v-if="item.icon" :icon="item.icon" />
            </span>
            <span class="text-2xs">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

interface QuickLinkItem {
  id: number;
  text: string;
  icon: string;
  active: boolean;
}

const quickLinks = reactive<QuickLinkItem[]>([
  { id: 1, text: "Next Up", icon: "game-icons:stopwatch", active: false },
  { id: 2, text: "Racing", icon: "la:horse-head", active: false },
  { id: 3, text: "ESports", icon: "fa6-solid:computer", active: false },
  { id: 4, text: "Notifications", icon: "fa6-regular:bell", active: false },
  { id: 5, text: "Menu", icon: "radix-icons:hamburger-menu", active: false },
]);

const toggleActive = (item: QuickLinkItem) => {
  quickLinks.forEach((link) => {
    if (link.id !== item.id) {
      link.active = false;
    }
  });
  item.active = !item.active;
};
</script>

<style scoped></style>
