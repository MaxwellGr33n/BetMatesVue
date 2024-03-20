<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import QuickLinks from "./components/QuickLinks.vue";
import { onMounted } from "vue";
import { useCurrentInSeasonSportsStore } from "@/stores/currentInSeasonSportsStore";
import { useCurrentEventsStore } from "./stores/currentEventsStore";

const currentInSeasonSportsStore = useCurrentInSeasonSportsStore();
const currentEventsStore = useCurrentEventsStore();

onMounted(async () => {
  currentEventsStore.loading = true;
  await currentEventsStore.ApiGetEvents("aussierules_afl");
  currentEventsStore.updateFilteredEvents("aussierules_afl");
  currentEventsStore.loading = false;

  await currentInSeasonSportsStore.fetchSports();

  for (const sport of currentInSeasonSportsStore.currentSports) {
    await currentEventsStore.ApiGetEvents(sport.key);
  }
  console.log("all data available");
});
</script>

<template>
  <NavBar />
  <div class="flex flex-col mx-auto items-center justify-center w-full sm:w-4/5 max-w-screen-lg">
    <RouterView />
  </div>
  <QuickLinks />
</template>
