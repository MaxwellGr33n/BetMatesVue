<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useCurrentEventsStore } from "./stores/currentEventsStore";
import NavBar from "./components/NavBar.vue";
import QuickLinks from "./components/QuickLinks.vue";
import { useBetsStore } from "./stores/betsStore";

const currentEventsStore = useCurrentEventsStore();
const betsStore = useBetsStore();

onMounted(async () => {
  currentEventsStore.loading = true;
  await betsStore.fetchAndPopulateUserData();
  await currentEventsStore.ApiGetEventsWithOdds("aussierules_afl");
  currentEventsStore.updateFilteredEvents("aussierules_afl");
  await currentEventsStore.ApiGetEventsWithOdds("rugbyleague_nrl");
  await currentEventsStore.ApiGetEventsWithOdds("soccer_australia_aleague");
  await currentEventsStore.ApiGetEventsWithOdds("baseball_mlb");
  await currentEventsStore.ApiGetEventsWithOdds("basketball_nba");
  currentEventsStore.loading = false;
});
</script>

<template>
  <NavBar />
  <div class="flex flex-col mx-auto items-center justify-center w-full sm:w-4/5 max-w-screen-lg">
    <RouterView />
  </div>
  <QuickLinks />
</template>
