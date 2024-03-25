// src/stores/authStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, type User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

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
        this.user = result.user;
        this.isLoggedIn = true;
      } catch (error) {
        this.errored = true;
        console.log(error);
        switch ((error as FirebaseError).code) {
          case "auth/invalid-credential":
            this.errMsg = "Email or password was incorrect";
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
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        this.user = result.user;
        this.isLoggedIn = true;
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
        const result = await createUserWithEmailAndPassword(getAuth(), email, password); 
        this.user = result.user;
        this.isLoggedIn = true; 
      } catch (error) {
        this.errored = true;
        switch ((error as FirebaseError).code) {
          case "auth/invalid-email":
            this.errMsg = "Email invalid";
            break;
          case "auth/email-already-in-use":
            this.errMsg = "Email already exists";
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
      } catch (error) {
        alert((error as Error).message);
      } finally {
        this.loading = false;
      }
    },
  },
});
