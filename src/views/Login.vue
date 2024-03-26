<template>
  <div class="w-full max-w-xs mt-10">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email"> Email </label>
        <p v-if="authStore.errored" class="text-red-600 text-xs mb-2">{{ authStore.errMsg }}</p>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'border-red-500': authStore.errored }"
          id="email"
          type="text"
          placeholder="Email"
          v-model="email"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password"> Password </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'border-red-500': authStore.errored }"
          id="password"
          type="password"
          placeholder="******************"
          v-model="password"
        />
        <p class="text-sm">New user? <button class="text-blue-500 text-sm" @click="router.push('/register')">Sign Up</button></p>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="authStore.signInWithEmailAndPassword(email, password)"
        >
          Sign In
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="handleGoogleSignIn"
        >
          Sign In With Google
        </button>
      </div>
    </form>
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
