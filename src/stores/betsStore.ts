// src/stores/betsStore.ts
import { defineStore } from 'pinia';
import { doc, setDoc, arrayUnion, getDoc, runTransaction, onSnapshot } from 'firebase/firestore';
import { db } from '@/main';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

interface IBetsData {
 eventID: string;
 h2hOdds: number;
 amountBet: number;
 teamToWin: string;
 betID: string;
 timePlaced: string;
 bookmaker: string;
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
    notificationMsg: ref(''),
    betOutcomeMsg: ref(''),
    errMsg: ref(''),
    isErrored: false,
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
      } else if (!userDoc.exists()) {
        this.initBalance(userId);
        console.error("User document does not exist.");
        this.errMsg = "User document does not exist.";
      }
      if (betslipDoc.exists()) {
        const betslipData = betslipDoc.data();
        this.bets = betslipData.bets as IBetsData[];
      } else {
        console.error("Betslip does not exist for this user.");
        this.errMsg = "Betslip does not exist for this user.";
      }
    },

    async addMoney(dollarsAdded: number) {
      const userRef = doc(db, "users", this.userId);
      let updatedBalance: number;

      if (dollarsAdded < 0) {
        console.error("New balance cannot be negative.");
        this.errMsg = "New balance cannot be negative."
      }

      await runTransaction(db, async (transaction) => {
       try { 
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          this.initBalance(this.userId);
          throw new Error("User does not exist.");
        }

        const currentBalance = userDoc.data().accountBalance;
        updatedBalance = currentBalance + dollarsAdded;

        transaction.update(userRef, { accountBalance: updatedBalance }); 
      } catch (error) {
        console.error("Transaction failed: ", error);
        }
      }).then(() => {
        this.accountBalance = updatedBalance;
      }).catch((error) => {
        console.error("Transaction failed: ", error);
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
            accountBalance: 10,
          });
        } else {
          throw new Error("This user is already setup.");
        }
      } catch (error) {
        console.error("Error initializing balance:", error);
      }
    },

    async placeBet(userId: string, betData: IBetsData) {
      this.isErrored = false;
      this.errMsg = '';
      this.notificationMsg = '';
      this.betOutcomeMsg = '';

      if (userId !== this.userId) return;
      const userRef = doc(db, "users", userId);
      const betslipRef = doc(db, "betslips", userId);
     
      if (betData.amountBet <= 0) {
        this.betOutcomeMsg = "Bet failed";
        this.errMsg = "Amount bet cannot be 0 or negative.";
        this.isErrored = true;
        console.error("Amount bet cannot be 0 or negative.");
      }

      return runTransaction(db, async (transaction) => {
         const userDoc = await transaction.get(userRef);
     
         if (!userDoc.exists()) {
          throw new Error("User does not exist!");
         }
     
         const userData = userDoc.data();
         const newBalance = userData.accountBalance - betData.amountBet;
     
         if (newBalance < 0) {
          this.betOutcomeMsg = "Bet failed";
          this.errMsg = "Insufficient balance to place bet!";
          throw new Error("Insufficient balance to place bet!");
         }
         // Update the user's account balance and add the bet
         transaction.update(userRef, { accountBalance: newBalance });
         transaction.update(betslipRef, { bets: arrayUnion(betData) });
         this.betOutcomeMsg = "Bet Success";
         this.notificationMsg = "Bet Placed for $ " + betData.amountBet + " With " + betData.bookmaker + " For " + betData.teamToWin + " to win" ;
         console.log("bet placed");
      }).then(async () => {
         const updatedBetslipDoc = await getDoc(betslipRef);
         if (updatedBetslipDoc.exists()) {
           this.bets = updatedBetslipDoc.data().bets as IBetsData[];
         }
         const updatedUserDoc = await getDoc(userRef);
         if (updatedUserDoc.exists()) {
           this.accountBalance = updatedUserDoc.data().accountBalance;
         }
      }).catch((error) => {
        this.betOutcomeMsg = "Bet Failed";
        this.errMsg = "Transaction failed: " + error;
        this.isErrored = true;
        console.error("Transaction failed: ", error);
      });
      },

    createBetsData(eventID: string, h2hOdds: number, amountBet: number, teamToWin: string, bookmaker: string): IBetsData | null {
      try {
        if (isNaN(amountBet)) {
          throw new Error("Amount bet must be a number");
        }

        if (!eventID || !/^[a-zA-Z0-9]+$/.test(eventID)) {
          throw new Error("Invalid event ID");
        }

        if (!teamToWin || !/^[a-zA-Z0-9 ]+$/.test(teamToWin)) {
          throw new Error("Invalid team to win");
        }

        if (!bookmaker || !/^[a-zA-Z0-9]+$/.test(bookmaker)) {
          throw new Error("Invalid bookmaker");
        }

        if (amountBet <= 0) {
          throw new Error("Must bet more than $0");
        }
        const betID = uuidv4(); //generates unique identifier for each bet
        const timePlaced = new Date().toISOString();
        console.log("created bet data");
        return {
          eventID,
          h2hOdds,
          amountBet,
          teamToWin,
          betID,
          timePlaced,
          bookmaker,
        };
      } catch (error) {
        if (error instanceof Error) {
          this.betOutcomeMsg = "Bet Failed";
          this.errMsg = "Error creating bet data: " + error.message;
          this.isErrored = true;
          console.error("Error creating bet data:", error.message);
        } else {
          console.error("Error creating bet data:", error);
        }
      }
      return null;
    },
  },
});
