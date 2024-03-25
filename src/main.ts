import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles.css'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseAPIKey = import.meta.env.VITE_FIREBASE_API_KEY;
// Your web app's Firebase configuration
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

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');