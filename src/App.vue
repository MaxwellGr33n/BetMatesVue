<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <div class="flex flex-col mx-auto items-center justify-center w-full sm:w-4/5 max-w-screen-lg">
    <RouterView /> 
  </div>
  
</template>

<style scoped>

</style>
