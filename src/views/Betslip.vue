<template>
  <div class="w-4/6">
    <h1 class="text-center font-logo text-3xl py-4">Betslip</h1>
    <div v-if="betsStore.bets.length > 0" class="flex flex-col gap-3">
      <div v-for="(bet, index) in betsStore.bets" :key="index" class="flex flex-col w-full bg-neutral-100 p-2 rounded-lg shadow-sm">
        <div class="flex items-center justify-between p-2">
          <svg class="h-24 md:h-32 w-24 md:w-32 p-2" aria-hidden="true">
            <use :href="`/Teams.svg#${bet.teamToWin}`"></use>
          </svg>
          <div class="p-2">
            <h2 class="text-lg font-medium">{{ bet.teamToWin }} @ {{ bet.h2hOdds }}</h2>
            <p>Stake: ${{ bet.amountBet }}</p>
            <p>Bookmaker: {{ bet.bookmaker }}</p>
            <p>Time Placed: {{ formatTime(bet.timePlaced) }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-300">{{ bet.betID }}</p>
      </div>
    </div>
    <div v-else>
      <p>You have no bets {{ authStore.user?.displayName }}</p>
    </div>
    <div class="absolute top-0 right-0">
      <svg class="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBetsStore } from "@/stores/betsStore";
import { useAuthStore } from "@/stores/authStore";
import { useCurrentEventsStore } from "@/stores/currentEventsStore";

const betsStore = useBetsStore();
const authStore = useAuthStore();
const currentEventsStore = useCurrentEventsStore();

const formatTime = (isoTime: string): string => {
  return currentEventsStore.formatTime(isoTime, false);
};
</script>
