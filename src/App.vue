<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useCurrentEventsStore } from "./stores/currentEventsStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "./stores/authStore";
import NavBar from "./components/NavBar.vue";
import QuickLinks from "./components/QuickLinks.vue";

const currentEventsStore = useCurrentEventsStore();
const authStore = useAuthStore();

onMounted(async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authStore.isLoggedIn = true;
    } else {
      authStore.isLoggedIn = false;
    }
  });

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
