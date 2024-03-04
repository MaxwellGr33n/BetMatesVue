<template>
  <nav class="flex justify-center fixed top-0 bg-violet-500 h-12 w-screen pl-4 z-10">
    <div class="flex justify-between items-center w-screen sm:w-4/5 max-w-screen-lg">
      <h1 class="font-logo italic text-2xl text-white">Betmates</h1>
      <ul class="flex justify-center items-center h-full">
        <li v-for="item in navItems" :key="item.id" class="flex border-l-[1px] border-neutral-600 shadow-inner text-white text-sm w-full h-full">
          <a @click="toggleActive(item)" :class="[item.active ? 'bg-violet-400 shadow-inner' : '', 'px-2 flex justify-center w-full h-full']">
            <span v-if="item.icon" class="flex items-center">
              <Icon v-if="item.icon" :icon="item.icon" />
            </span>
            <span class="flex items-center">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
  <div class="pt-12"></div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

interface NavItem {
  id: number;
  text?: string;
  icon?: string;
  active: boolean;
}

const navItems = reactive<NavItem[]>([
  { id: 1, icon: "fa6-solid:magnifying-glass", active: false },
  { id: 2, text: "Login", active: false },
  { id: 3, text: "Register", active: false },
]);

const toggleActive = (item: NavItem) => {
  navItems.forEach((link) => {
    if (link.id !== item.id) {
      link.active = false;
    }
  });
  item.active = !item.active;
};
</script>
