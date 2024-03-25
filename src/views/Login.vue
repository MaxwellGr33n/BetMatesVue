<template>
  <div class="w-full h-12">
    <h1 class="text-lg">Login</h1>
    <p v-if="authStore.errored" class="text-red-600 text-xs">{{ authStore.errMsg }}</p>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="authStore.signInWithEmailAndPassword(email, password)">Submit</button></p>
    <p><button @click="handleGoogleSignIn">Sign in with Google</button></p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");

const handleGoogleSignIn = async () => {
  await authStore.signInWithGoogle();
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/");
    }
  });
});
</script>
