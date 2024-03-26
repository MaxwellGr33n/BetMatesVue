// src/stores/betsStore.ts
import { defineStore } from 'pinia';
import { doc, setDoc, arrayUnion, getDoc, runTransaction, onSnapshot } from 'firebase/firestore';
import { db } from '@/main';

interface IBetsData {
 eventID: string;
 h2hOdds: number;
 amountBet: number;
 teamToWin: string;
 betID: string;
}

interface IUserData {
 userId: string;
 accountBalance: number;
}

export const useBetsStore = defineStore({
 id: 'bets',
 state: () => ({
    userId: '',
    accountBalance: 0,
    bets: [] as IBetsData[],
 }),
  actions: {
    async fetchAndPopulateUserData(userId: string) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const betslipRef = doc(db, "betslips", userId);
      const betslipDoc = await getDoc(betslipRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as IUserData;
        this.userId = userData.userId;
        this.accountBalance = userData.accountBalance;
        // Update other state properties as necessary
      } else {
        console.error("User document does not exist.");
      }
      if (betslipDoc.exists()) {
        const betslipData = betslipDoc.data();
        this.bets = betslipData.bets as IBetsData[];
      } else {
        console.error("Betslip does not exist for this user.");
      }
    },

    async addMoney(dollarsAdded: number) {
      const userRef = doc(db, "users", this.userId);

      if (dollarsAdded < 0) {
        throw new Error("New balance cannot be negative.");
      }

      await runTransaction(db, async (transaction) => {
       try { 
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          throw new Error("User does not exist.");
        }

        const currentBalance = userDoc.data().accountBalance;
        const updatedBalance = currentBalance + dollarsAdded;

        // Note: This might not be necessary if the transaction is successful,
        // as the local state should already be in sync with the database.
        // However, it's kept here for completeness.
        this.accountBalance = updatedBalance;
      } catch (error) {
        console.error("Transaction failed: ", error);
        }
      });
    },

    async listenForAccountBalanceChanges() {
      const userRef = doc(db, "users", this.userId);
      onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          this.accountBalance = docSnapshot.data().accountBalance;
        }
      });
    },

    async initBetslip(userId: string) {
      try {
        const betslipRef = doc(db, "betslips", userId);
        const betslipDoc = await getDoc(betslipRef);

        if (!betslipDoc.exists()) {
          await setDoc(betslipRef, {
            userId: userId,
            createdAt: new Date().toISOString(),
            bets: [],
          });
        } else {
          throw new Error("A betslip with this userID already exists.");
        }
      } catch (error) {
        console.error("Error creating betslip:", error);
      }
    },

    async initBalance(userId: string) {
      try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            userId: userId,
            accountBalance: 0,
          });
        } else {
          throw new Error("This user is already setup.");
        }
      } catch (error) {
        console.error("Error initializing balance:", error);
      }
    },

    async placeBet(userId: string, betData: IBetsData) {
      if (userId !== this.userId) return;
      const userRef = doc(db, "users", userId);
      const betslipRef = doc(db, "betslips", userId);
     
      return runTransaction(db, async (transaction) => {
         const userDoc = await transaction.get(userRef);
     
         if (!userDoc.exists()) {
           throw new Error("User does not exist!");
         }
     
         const userData = userDoc.data();
         const newBalance = userData.accountBalance - betData.amountBet;
     
         if (newBalance < 0) {
           throw new Error("Insufficient balance to place bet!");
         }
         // Update the user's account balance and add the bet
         transaction.update(userRef, { accountBalance: newBalance });
         transaction.update(betslipRef, { bets: arrayUnion(betData) });
      }).then(async () => {
         const updatedBetslipDoc = await getDoc(betslipRef);
         if (updatedBetslipDoc.exists()) {
           this.bets = updatedBetslipDoc.data().bets as IBetsData[];
         }
      }).catch((error) => {
         console.error("Transaction failed: ", error);
         // Handle the error, e.g., by showing an error message to the user
      });
      }
    // Additional actions for fetching betslips, updating betslips, etc.
 },
});
