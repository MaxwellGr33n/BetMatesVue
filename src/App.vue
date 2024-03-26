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
  // await currentEventsStore.ApiGetEventsWithOdds("aussierules_afl");
  currentEventsStore.updateFilteredEvents("aussierules_afl");
  currentEventsStore.loading = false;
  console.log(JSON.stringify(currentEventsStore.currentEvents, null, 2));
  console.log(JSON.stringify(betsStore.bets));
  console.log(betsStore.userId);
});
</script>

<template>
  <NavBar />
  <div class="flex flex-col mx-auto items-center justify-center w-full sm:w-4/5 max-w-screen-lg">
    <RouterView />
  </div>
  <QuickLinks />
</template>
