<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import QuickLinks from "./components/QuickLinks.vue";
import { onMounted } from "vue";
import { useCurrentEventsStore } from "./stores/currentEventsStore";

const currentEventsStore = useCurrentEventsStore();

onMounted(async () => {
  currentEventsStore.loading = true;
  await currentEventsStore.ApiGetEvents("aussierules_afl");
  currentEventsStore.updateFilteredEvents("aussierules_afl");
  await currentEventsStore.ApiGetEvents("rugbyleague_nrl");
  await currentEventsStore.ApiGetEvents("soccer_australia_aleague");
  await currentEventsStore.ApiGetEvents("baseball_mlb");
  await currentEventsStore.ApiGetEvents("basketball_nba");
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
