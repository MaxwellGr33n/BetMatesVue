<template>
  <section class="w-full px-3 pb-3">
    <div class="flex items-center pb-3">
      <h2 class="flex text-lg font-semibold">Next Racing</h2>
      <Icon icon="material-symbols:arrow-forward-ios" />
    </div>
    <ul class="w-full h-fit bg-neutral-50 rounded-md drop-shadow">
      <li v-for="item in events" :key="item.id" class="w-full h-1/5 border-[1px]">
        <a
          @click="toggleActive(item)"
          :class="['flex h-full p-3 items-center justify-between', item.active ? 'bg-neutral-100 shadow-inner' : 'bg-white']"
        >
          <div class="h-2/3 flex items-center">
            <Icon v-if="item.icon" :icon="item.icon" height="22px" />
            <span class="text-sm pl-2">{{ item.text }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span v-if="item.timeToEvent" class="mb-[2px] text-sm">{{ item.timeToEvent }}</span>
            <Icon icon="material-symbols:arrow-forward-ios" />
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

let interval = 0;

interface eventItem {
  id: string;
  text: string;
  icon: string;
  active: boolean;
  timeOfEvent: string; //ISO 8601
  timeToEvent?: string;
}

const events = reactive<eventItem[]>([
  { id: "1a1a1a", text: "Nowra", icon: "la:horse-head", active: false, timeOfEvent: "2024-03-11T03:31:23Z" },
  { id: "2a2a2a", text: "Hamilton", icon: "la:horse-head", active: false, timeOfEvent: "2024-03-11T03:30:11Z" },
  { id: "3a3a3a", text: "Flemington", icon: "la:horse-head", active: false, timeOfEvent: "2024-03-11T03:32:56Z" },
  { id: "4a4a4a", text: "Ascot", icon: "la:horse-head", active: false, timeOfEvent: "2024-03-11T03:32:14Z" },
  { id: "5a5a5a", text: "ESL Season 19: CS2", icon: "fa6-solid:computer", active: false, timeOfEvent: "2024-03-11T03:32:16Z" },
  { id: "6a6a6a", text: "TestRace", icon: "la:horse-head", active: false, timeOfEvent: "2024-03-11T03:31:38Z" },
]);

const toggleActive = (item: eventItem) => {
  events.forEach((link) => {
    if (link.id !== item.id) {
      link.active = false;
    }
  });
  item.active = !item.active;
};

const startCountdown = (eventId: string) => {
  const eventItem = events.find((item) => item.id === eventId);
  if (!eventItem) return;
  if (!eventItem.timeOfEvent) return;

  const countdown = () => {
    const now = new Date();
    const start = new Date(eventItem.timeOfEvent); // Convert ISO 8601 string to Date object
    const timeRemaining = start.getTime() - now.getTime();

    if (timeRemaining <= 0) {
      eventItem.timeToEvent = "Live";
      return;
    }
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    eventItem.timeToEvent = `${hours.toString()}:${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
  };

  countdown(); // Initial countdown
  interval = setInterval(countdown, 1000);
};

onMounted(() => {
  events.forEach((event) => {
    startCountdown(event.id);
  });
});
</script>

<style scoped></style>
