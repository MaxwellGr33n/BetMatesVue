<template>
  <section v-if="!currentEventsStore.errored" class="w-full flex flex-col px-3 pb-3">
    <div class="flex items-center pb-3">
      <h2 class="flex text-lg font-semibold">Next Events</h2>
      <Icon icon="material-symbols:arrow-forward-ios" />
    </div>
    <div class="flex items-center justify-center">
      <Icon v-if="currentEventsStore.loading" height="48px" icon="eos-icons:loading" />
    </div>
    <p v-if="currentEventsStore.errored">API error fetching event data...</p>
    <ul v-if="!currentEventsStore.loading" class="w-full h-fit bg-neutral-50 rounded-md drop-shadow">
      <li v-for="item in currentEventsStore.filteredEvents" :key="item.id" class="w-full h-1/5 border-[1px]">
        <a
          @click="toggleActive(item)"
          :class="['flex h-full p-3 items-center justify-between', item.isClicked ? 'bg-neutral-100 shadow-inner' : 'bg-white']"
        >
          <div class="h-2/3 flex items-center">
            <Icon v-if="item.sports_icon" :icon="item.sports_icon" height="22px" />
            <span class="text-sm pl-2">{{ item.home_team }} vs {{ item.away_team }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="mb-[2px] text-sm">{{ item.time_to_commence }}</span>
            <Icon :icon="item.active ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" />
          </div>
        </a>
        <div v-if="item.active" class="flex flex-col w-full bg-neutral-200">
          <div class="grid grid-cols-3 grid-rows-1">
            <div class="flex flex-col pt-10 items-center justify-center">
              <svg class="h-32 md:h-52 w-full" aria-hidden="true">
                <use :href="`/Teams.svg#${item.home_team}`"></use>
              </svg>
              <p class="h-1/3 pt-1 md:text-lg font-semibold">{{ item.home_team.split(" ").pop() }}</p>
            </div>
            <div class="pt-3 flex flex-col items-center justify-between text-sm md:text-md">
              <p class="text-xs md:text-lg">{{ currentEventsStore.formatTime(item.commence_time) }}</p>
              <p class="pb-10 text-xl font-medium">vs</p>
            </div>
            <div class="flex flex-col pt-10 items-center justify-between">
              <svg class="h-32 md:h-52 w-full" aria-hidden="true">
                <use :href="`/Teams.svg#${item.away_team}`"></use>
              </svg>
              <p class="h-1/3 pt-1 md:text-lg font-semibold">{{ item.away_team.split(" ").pop() }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between px-6 md:px-24 py-4">
            <button
              class="text-sm font-semibold cursor-pointer leading-6 px-5 py-3 rounded-full text-gray-900 bg-white hover:bg-neutral-50 dark:text-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-900 hover:shadow-md focus:shadow-md"
            >
              {{ (Math.random() * 9 + 1).toFixed(2) }}
            </button>
            <button
              class="text-sm font-semibold cursor-pointer leading-6 px-5 py-3 rounded-full text-gray-900 bg-white hover:bg-neutral-50 dark:text-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-900 hover:shadow-md focus:shadow-md"
            >
              {{ (Math.random() * 9 + 1).toFixed(2) }}
            </button>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useCurrentEventsStore, type IcurrentEventsData } from "@/stores/currentEventsStore";

const currentEventsStore = useCurrentEventsStore();

const toggleActive = (event: IcurrentEventsData) => {
  Object.values(currentEventsStore.currentEvents).flat().forEach((link) => {
    if (link.id !== event.id) {
      link.active = false;
    }
  });
  event.active = !event.active;
  event.isClicked = true; // Set isClicked to true immediately

  setTimeout(() => {
    event.isClicked = false;
  }, 100);
};
</script>
