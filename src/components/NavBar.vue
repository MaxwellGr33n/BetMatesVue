<template>
  <nav class="flex justify-center fixed top-0 bg-violet-500 h-12 w-screen z-10">
    <div class="flex justify-between items-center w-screen sm:w-4/5 max-w-screen-lg">
      <RouterLink to="/" class="font-logo pl-2 italic text-2xl text-white">Betmates</RouterLink>
      <ul class="flex justify-center items-center h-full">
        <li v-if="!authStore.isLoggedIn" class="flex border-l-[1px] px-2 border-neutral-600 shadow-inner text-white text-sm w-full h-full">
          <RouterLink class="flex items-center" to="/login">Login</RouterLink>
        </li>
        <li v-if="!authStore.isLoggedIn" class="flex border-l-[1px] px-2 border-neutral-600 shadow-inner text-white text-sm w-full h-full">
          <RouterLink class="flex items-center" to="/register">Register</RouterLink>
        </li>
        <li
          v-if="authStore.isLoggedIn"
          @click="betStore.addMoney(1)"
          class="flex items-center cursor-pointer border-l-[1px] pl-2 pr-1 border-neutral-600 shadow-inner text-white text-sm w-full h-full"
        >
          <p class="text-nowrap px-1" v-if="authStore.user?.displayName">Funds: ${{ betStore.accountBalance.toFixed(2) }}</p>
        </li>
        <li
          v-if="authStore.isLoggedIn"
          class="flex items-center border-l-[1px] pl-2 pr-1 border-neutral-600 shadow-inner text-white text-sm w-full h-full"
        >
          <Icon icon="material-symbols:account-circle" height="28px" />
          <p class="text-nowrap px-1" v-if="authStore.user?.displayName">Hi {{ authStore.user.displayName }}</p>
        </li>
        <li v-if="authStore.isLoggedIn" class="flex border-x-[1px] pl-3 md:pr-2 border-neutral-600 shadow-inner text-white text-sm w-full h-full">
          <button @click="authStore.signOut">
            <Icon icon="material-symbols:logout" height="22px" />
          </button>
        </li>
      </ul>
    </div>
  </nav>
  <div class="pt-12"></div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useBetsStore } from "@/stores/betsStore";

const betStore = useBetsStore();
const authStore = useAuthStore();
</script>
