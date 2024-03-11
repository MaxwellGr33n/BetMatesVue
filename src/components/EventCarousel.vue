<template>
  <section class="">
    <ul class="h-16 flex px-3 mt-4 gap-3">
      <li v-for="item in featured" :key="item.id" class="aspect-square h-full">
        <a
          @click="toggleActive(item)"
          :class="[
            'flex flex-col items-center w-full h-full p-2 rounded-md drop-shadow',
            item.isClicked ? 'bg-neutral-100 shadow-inner' : 'bg-white',
          ]"
        >
          <span v-if="item.icon" class="h-2/3 flex items-center">
            <Icon v-if="item.icon" :icon="item.icon" height="28px" />
          </span>
          <span class="text-2xs mt-1">{{ item.text }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

interface FeaturedItem {
  id: number;
  text: string;
  icon: string;
  active: boolean;
  isClicked: boolean;
}

const featured = reactive<FeaturedItem[]>([
  { id: 1, text: "Promotions", icon: "bx:bxs-badge-dollar", active: false, isClicked: false },
  { id: 2, text: "Randwick", icon: "la:horse-head", active: false, isClicked: false },
  { id: 3, text: "Flemington", icon: "la:horse-head", active: false, isClicked: false },
  { id: 4, text: "ESports", icon: "fa6-solid:computer", active: false, isClicked: false },
  { id: 5, text: "Fights", icon: "iconoir:boxing-glove", active: false, isClicked: false },
]);

const toggleActive = (item: FeaturedItem) => {
  featured.forEach((link) => {
    if (link.id !== item.id) {
      link.active = false;
    }
  });
  item.active = !item.active;
  item.isClicked = true; // Set isClicked to true immediately

  setTimeout(() => {
    item.isClicked = false;
  }, 100);
};
</script>

<style scoped></style>
