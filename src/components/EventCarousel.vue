<template>
  <section class="mb-2 h-28 md:h-48 w-full">
    <ul
      class="flex h-full p-3 gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap md:overflow-hidden md:whitespace-normal justify-start md:justify-center"
      id="event-carousel"
    >
      <li v-for="item in featured" :key="item.id" class="flex h-24 md:h-40 aspect-square">
        <a
          @click="
            toggleActive(item);
            currentEvents.updateFilteredEvents(item.toFetch);
          "
          :class="[
            'flex flex-col justify-between h-full w-full items-center p-2 rounded-md drop-shadow',
            item.isClicked ? 'bg-neutral-100 shadow-inner' : 'bg-white',
          ]"
        >
          <div v-if="item.icon" class="flex h-2/3 w-full items-center justify-center">
            <Icon v-if="item.icon" :icon="item.icon" class="w-12 h-8 md:h-16 lg:h-18 xl:h-20 2xl:h-24" />
          </div>
          <div class="flex h-1/3 w-full items-center justify-center">
            <span class="text-2xs text-center text-wrap">{{ item.text }}</span>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useCurrentEventsStore } from "@/stores/currentEventsStore";

const currentEvents = useCurrentEventsStore();

interface FeaturedItem {
  id: number;
  text: string;
  icon: string;
  active: boolean;
  isClicked: boolean;
  toFetch: string;
}

const featured = reactive<FeaturedItem[]>([
  { id: 1, text: "AFL Footy", icon: "mdi:football-australian", active: false, isClicked: false, toFetch: "aussierules_afl" },
  { id: 2, text: "NRL Rugby", icon: "material-symbols:sports-rugby", active: false, isClicked: false, toFetch: "rugbyleague_nrl" },
  { id: 3, text: "Champs League", icon: "game-icons:soccer-ball", active: false, isClicked: false, toFetch: "soccer_efl_champ" },
  { id: 4, text: "MLB Baseball", icon: "ion:baseball", active: false, isClicked: false, toFetch: "baseball_mlb" },
  { id: 5, text: "NBA Basketball", icon: "solar:basketball-bold", active: false, isClicked: false, toFetch: "basketball_nba" },
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

<style scoped>
#event-carousel::-webkit-scrollbar {
  display: none;
}

#event-carousel {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
