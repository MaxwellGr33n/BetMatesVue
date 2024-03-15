<template>
  <section class="w-full px-3 pb-3">
    <div class="flex items-center pb-3">
      <h2 class="flex text-lg font-semibold">Next Racing</h2>
      <Icon icon="material-symbols:arrow-forward-ios" />
    </div>
    <ul class="w-full h-fit bg-neutral-50 rounded-md drop-shadow">
      <li v-for="item in currentEventsBySport.currentEvents" :key="item.id" class="w-full h-1/5 border-[1px]">
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
            <Icon :icon="item.active ? 'material-symbols:keyboard-arrow-down' : 'material-symbols:keyboard-arrow-right'" />
          </div>
        </a>
        <div v-if="item.active" class="h-28 w-full bg-neutral-200"></div>
      </li>
    </ul>
    <div class="sports-container">
      <div v-for="(event, index) in currentEventsBySport.currentEvents" :key="index" class="sports-item">
        <p>{{ event }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useCurrentEventsBySportStore, type IcurrentEventBySportData } from "@/stores/currentEventsBySportStore";

const currentEventsBySport = useCurrentEventsBySportStore();

const toggleActive = (event: IcurrentEventBySportData) => {
  currentEventsBySport.currentEvents.forEach((link) => {
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

onMounted(async () => {
  await currentEventsBySport.fetchEvents("aussierules_afl");
  console.log(JSON.parse(JSON.stringify(currentEventsBySport.currentEvents)));
  currentEventsBySport.currentEvents.forEach((currentEvent) => {
    currentEventsBySport.startCountdown(currentEvent.id);
  });
});
</script>
