<template>
  <div class="w-full max-w-sm mt-10">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-3">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="displayName"> Display Name </label>
        <p v-if="authStore.errored" class="text-red-600 text-xs mb-2">{{ authStore.errMsg }}</p>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'border-red-500': authStore.errored }"
          id="displayName"
          type="text"
          placeholder="Display Name"
          v-model="displayName"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email"> Email </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'border-red-500': authStore.errored }"
          id="email"
          type="text"
          placeholder="Email"
          v-model="email"
        />
      </div>
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password"> Password </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
          :class="{ 'border-red-500': authStore.errored }"
          id="password"
          type="password"
          placeholder="******"
          v-model="password"
        />
      </div>
      <p class="text-sm mb-4">Already a user? <button class="text-blue-500 text-sm" @click="router.push('/login')">Login</button></p>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="submitForm"
        >
          Register
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
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const displayName = ref("");
const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const handleGoogleSignIn = async () => {
  await authStore.signInWithGoogle();
};

const submitForm = () => {
  if (displayName.value.trim() === "") {
    authStore.errMsg = "Display name is required";
    authStore.errored = true;
  } else {
    authStore.register(email.value, password.value, displayName.value);
  }
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
