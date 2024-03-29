import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from './stores/authStore';
import './assets/styles.css'

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { useBetsStore } from './stores/betsStore';
// TODO: Add SDKs for Firebase products that you want to use

const firebaseAPIKey = process.env.FIREBASE_API_KEY; 
// const firebaseAPIKey = import.meta.env.VITE_FIREBASE_API_KEY; //dev import

const firebaseConfig = {
  apiKey: firebaseAPIKey,
  authDomain: "betmates-e4e02.firebaseapp.com",
  projectId: "betmates-e4e02",
  storageBucket: "betmates-e4e02.appspot.com",
  messagingSenderId: "1058387916158",
  appId: "1:1058387916158:web:9f13006203b499ed216f2f"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = getAuth();
const authStore = useAuthStore();
const betsStore = useBetsStore();

onAuthStateChanged(auth, async (user) => {
 if (user) {
    authStore.user = user;
    await betsStore.fetchAndPopulateUserData();
    authStore.isLoggedIn = true;
 } else {
    authStore.user = null;
    authStore.isLoggedIn = false;
 }
});

app.mount('#app');
