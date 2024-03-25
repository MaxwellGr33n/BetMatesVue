// src/stores/authStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore({
 id: 'auth',
 state: () => ({
    user: ref<User | null>(null),
    isLoggedIn: false,
    loading: false,
    errored: false,
    errMsg: ref(''),
 }),
 actions: {
    async signInWithEmailAndPassword(email: string, password: string) {
      this.loading = true;
      this.errored = false;
      this.errMsg = '';
      try {
        const result = await signInWithEmailAndPassword(getAuth(), email, password);
        // const router = useRouter();
        // router.push("/");
        this.user = result.user;
        this.isLoggedIn = true;
      } catch (error) {
        this.errored = true;
        console.log("there was an error");
        switch ((error as FirebaseError).code) {
          case "auth/invalid-credential":
            this.errMsg = "Wrong password";
            break;
          case "auth/user-not-found":
            this.errMsg = "User not found";
            break;
          case "auth/wrong-password":
            this.errMsg = "Incorrect password";
            break;
          default:
            this.errMsg = "Email or password was incorrect";
            break;
          }
        } finally {
          this.loading = false;
        }
    },


    async signInWithGoogle() {
      this.loading = true;
      this.errored = false;
      this.errMsg = '';
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(getAuth(), provider);
        this.user = result.user;
        this.isLoggedIn = true;
        // Redirect to home page or any other page after successful login
        const router = useRouter();
        router.push("/");
      } catch (error) {
        this.errored = true;
        this.errMsg = "Failed to sign in with Google";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },


    async register(email: string, password: string) {
      this.loading = true;
      this.errored = false;
      this.errMsg = '';
      try {
        await createUserWithEmailAndPassword(getAuth(), email, password);
      } catch (error) {
        switch ((error as FirebaseError).code) {
          case "auth/invalid-credential":
            this.errMsg = "Wrong password";
            break;
          case "auth/user-not-found":
            this.errMsg = "User not found";
            break;
          case "auth/wrong-password":
            this.errMsg = "Incorrect password";
            break;
          default:
            this.errMsg = "Email or password was incorrect";
            break;
        }
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      this.loading = true;
      this.errored = false;
      this.errMsg ='';
      try {
        await signOut(getAuth());
        this.isLoggedIn = false;
        this.user = null;
        // const router = useRouter();
        // router.push("/");
      } catch (error) {
        alert((error as Error).message);
      } finally {
        this.loading = false;
      }
    },
  },
});
