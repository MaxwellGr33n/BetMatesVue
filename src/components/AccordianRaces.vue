<template>
  <section class="w-full px-3 pb-3">
    <div class="flex items-center pb-3">
      <h2 class="flex text-lg font-semibold">Next Racing</h2>
      <Icon icon="material-symbols:arrow-forward-ios" />
    </div>
    <ul class="w-full h-fit bg-neutral-50 rounded-md drop-shadow">
      <li v-for="item in accordianEvents" :key="item.id" class="w-full h-1/5 border-[1px]">
        <a
          @click="toggleActive(item)"
          :class="['flex h-full p-3 items-center justify-between', item.active ? 'bg-neutral-100 shadow-inner' : 'bg-white']"
        >
          <div v-if="item.icon" class="h-2/3 flex items-center">
            <Icon v-if="item.icon" :icon="item.icon" height="22px" />
            <span class="text-xs pl-2">{{ item.text }}</span>
          </div>
          <Icon icon="material-symbols:arrow-forward-ios" />
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

interface AccordianItem {
  id: number;
  text: string;
  icon: string;
  active: boolean;
}

const accordianEvents = reactive<AccordianItem[]>([
  { id: 1, text: "Nowra", icon: "la:horse-head", active: false },
  { id: 2, text: "Hamilton", icon: "la:horse-head", active: false },
  { id: 3, text: "Flemington", icon: "la:horse-head", active: false },
  { id: 4, text: "Ascot", icon: "la:horse-head", active: false },
  { id: 5, text: "ESL Season 19: CS2", icon: "fa6-solid:computer", active: false },
]);

const toggleActive = (item: AccordianItem) => {
  accordianEvents.forEach((link) => {
    if (link.id !== item.id) {
      link.active = false;
    }
  });
  item.active = !item.active;
};
</script>

<style scoped></style>
