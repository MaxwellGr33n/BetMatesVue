<template>
  <div class="w-full h-12">
    <h1 class="text-lg">Register</h1>
    <p v-if="authStore.errored" class="text-red-600 text-xs">{{ authStore.errMsg }}</p>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="authStore.register(email, password)">Submit</button></p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/");
    }
  });
});
</script>

<style scoped></style>
