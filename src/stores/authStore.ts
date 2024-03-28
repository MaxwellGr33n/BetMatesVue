// src/stores/authStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile, type User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useBetsStore } from './betsStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/main';

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
        const betsStore = useBetsStore();

        // Fetch the user's betslip and user documents
        const betslipRef = doc(db, "betslips", result.user.uid);
        const betslipDoc = await getDoc(betslipRef);
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);

        if (!betslipDoc.exists()) {
          await betsStore.initBetslip(result.user.uid);
        } else if (!userDoc.exists()) {
          await betsStore.initBalance(result.user.uid);
        } else {
          console.log("User already has a betslip and user document.");
        }
        this.isLoggedIn = true;
      } catch (error) {
        this.errored = true;
        this.errMsg = "Failed to sign in with Google";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },


    async register(email: string, password: string, displayName: string) {
      this.loading = true;
      this.errored = false;
      this.errMsg = '';
      try {
        const auth = getAuth();
        const result = await createUserWithEmailAndPassword(auth, email, password); 
        this.user = result.user;
        await updateProfile(result.user, { displayName });
        const betsStore = useBetsStore();
        await betsStore.initBetslip(result.user.uid); 
        await betsStore.initBalance(result.user.uid);
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
            this.errMsg = "Error please try again";
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
