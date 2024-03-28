<template>
  <section class="relative py-5 px-3 w-full">
    <a href="https://www.ufc.com/" target="_blank">
      <div class="flex items-center justify-center bg-violet-500 rounded-md p-3">
        <img
          class="absolute top-5"
          src="https://www.ladbrokes.com.au/images/ladbrokes/feature-event/featured-event-cta-banner--light.svg"
          width="120px"
        />
        <div class="w-full ml-7">
          <h2 class="mt-2 text-center text-white font-semibold text-lg">UFC 300 MAIN EVENT:</h2>
          <p class="text-center text-white">PEREIRA VS HILL</p>
        </div>
        <Icon icon="material-symbols:arrow-forward-ios" height="28px" style="color: white" />
      </div>
    </a>
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
</script>

<style scoped></style>
