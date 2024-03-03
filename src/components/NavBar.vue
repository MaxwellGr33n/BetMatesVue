<template>
    <nav class="flex justify-center fixed top-0 bg-violet-500 h-12 w-screen pl-4 z-10">
       <div class="flex justify-between items-center w-screen sm:w-4/5 max-w-screen-lg">
         <h1 class="font-logo italic text-2xl text-white">Betmates</h1>
         <ul class="flex h-full">
           <li v-for="item in navbarItems" :key="item.id" class="m-auto px-2 flex items-center border-l-[1px] border-neutral-600 shadow-inner text-white text-sm h-full ">
             <span :class="[item.active ? 'bg-violet-400' : '']">
               <FontAwesomeIcon v-if="item.icon" :icon="item.icon" class="px-2" />
               {{ item.text }}
             </span>
           </li>
         </ul>
       </div>
    </nav>
    <div class="pt-12"></div>
   </template>
   
   <script setup lang="ts">
    import { reactive } from 'vue';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

    const navbarItems = reactive([
      { id: 1, text: '', icon: faMagnifyingGlass, active: false },
      { id: 2, text: 'Login', active: false },
      { id: 3, text: 'Register', active: false },
    ]);
   </script>