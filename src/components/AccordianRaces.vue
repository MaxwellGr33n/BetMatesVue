<template>
  <section v-if="!currentEventsStore.errored" class="w-full flex flex-col px-3 pb-3">
    <div class="relative">
      <teleport to="body">
        <div class="fixed top-0 left-0 bg-black/40 w-screen h-screen flex justify-center items-center p-4" v-if="notificationStore.isOpen">
          <modal-content :title="betStore.betOutcomeMsg" :msg="betStore.isErrored ? betStore.errMsg : betStore.notificationMsg" />
        </div>
      </teleport>
    </div>
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
          <div class="grid grid-cols-3 grid-rows-1 pb-10 pt-4">
            <div class="flex flex-col m-auto items-center justify-center">
              <svg class="h-32 md:h-52 w-full" aria-hidden="true">
                <use :href="`/Teams.svg#${item.home_team}`"></use>
              </svg>
              <p class="h-1/3 pt-1 md:text-lg font-semibold">{{ item.home_team.split(" ").pop() }}</p>
            </div>
            <div class="flex flex-col items-center justify-between text-sm md:text-md">
              <p
                :class="[
                  'text-xs md:text-lg text-center bg-neutral-50 rounded-md px-2',
                  { 'bg-red-500 text-white font-semibold': currentEventsStore.formatTime(item.commence_time, true) === 'LIVE' },
                ]"
              >
                {{ currentEventsStore.formatTime(item.commence_time, true) }}
              </p>
              <p class="align-text-top text-xl font-medium">vs</p>
            </div>
            <div class="flex flex-col m-auto items-center justify-between">
              <svg class="h-32 md:h-52 w-full" aria-hidden="true">
                <use :href="`/Teams.svg#${item.away_team}`"></use>
              </svg>
              <p class="h-1/3 pt-1 md:text-lg font-semibold">{{ item.away_team.split(" ").pop() }}</p>
            </div>
          </div>
          <div class="flex items-center justify-center" v-if="!authStore.isLoggedIn">
            <p class="text-xl p-5">Log in now to see live odds</p>
          </div>
          <div class="flex flex-col items-center" v-if="authStore.isLoggedIn">
            <div v-if="item.bookmakers" class="flex w-11/12 items-center justify-center pb-4">
              <h2 class="flex-1 text-sm md:text-lg mr-auto pr-1">{{ item.home_team }}</h2>
              <div class="flex flex-1 justify-center items-center">
                <p class="text-gray-500 pr-1">$</p>
                <input
                  class="appearance-none w-32 rounded-md bg-white text-gray-700 py-1 px-2 leading-tight text-center focus:outline-none"
                  type="text"
                  placeholder="Stake amount"
                  aria-label="Bet Amount"
                  v-model="userInputAmount"
                />
              </div>
              <h2 class="flex-1 text-sm md:text-lg ml-auto text-right pl-1">{{ item.away_team }}</h2>
            </div>
            <div v-for="bookmaker in item.bookmakers" :key="bookmaker.key" class="flex flex-col items-center w-5/ border-t border-gray-300 w-11/12">
              <svg class="w-[10%] h-12 absolute mt-2" aria-hidden="true">
                <use :href="`/Bookmakers.svg#${bookmaker.key}`"></use>
              </svg>
              <div class="flex w-full items-center justify-between">
                <div
                  v-for="outcome in sortedOutcomes(bookmaker.markets[0].outcomes, item.home_team, item.away_team)"
                  class="flex items-center justify-between py-4"
                >
                  <button
                    @click="
                      {
                        const betData = betStore.createBetsData(item.id, outcome.price, +userInputAmount, outcome.name, bookmaker.title);
                        if (betData) {
                          betStore.placeBet(betData);
                        }
                        notificationStore.isOpen = true;
                      }
                    "
                    :class="[
                      'text-sm font-semibold min-w-16 cursor-pointer leading-6 px-3 py-1 rounded-md text-white hover:shadow-md focus:shadow-md',
                      bookmaker.key === 'neds'
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : bookmaker.key === 'ladbrokes_au'
                        ? 'bg-red-600 hover:bg-red-700'
                        : bookmaker.key === 'sportsbet'
                        ? 'bg-blue-800 hover:bg-blue-900'
                        : bookmaker.key === 'tab' || bookmaker.key === 'unibet'
                        ? 'bg-green-700 hover:bg-green-800'
                        : '',
                    ]"
                  >
                    ${{ outcome.price.toFixed(2) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useCurrentEventsStore, type IOutcome, type IcurrentEventsData } from "@/stores/currentEventsStore";
import { useBetsStore } from "@/stores/betsStore";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from '@/stores/notificationStore';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/main";
import ModalContent from './ModalContent.vue';

const notificationStore = useNotificationStore();
const currentEventsStore = useCurrentEventsStore();
const authStore = useAuthStore();
const betStore = useBetsStore();
const userRef = doc(db, "users", authStore.user?.uid ?? "defaultUid");
const userInputAmount = ref('');

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

const sortedOutcomes = (outcomes: IOutcome[], homeTeam: string, awayTeam: string) => {
  return outcomes.sort((a: IOutcome, b: IOutcome) => {
    if (a.name === homeTeam) return -1;
    if (a.name === awayTeam) return 1;
    return 0;
  });
};

onSnapshot(userRef, (docSnapshot) => {
  if (docSnapshot.exists()) {
    betStore.accountBalance = docSnapshot.data().accountBalance;
  }
});
</script>
