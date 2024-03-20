import { defineStore } from 'pinia';
import axios from 'axios';

export interface IcurrentInSeasonSportData {
  key: string;
  active: boolean;
  group: string;
  description: string; 
  title: string;
  has_outrights: string;
}

export const useCurrentInSeasonSportsStore = defineStore({
  id: 'currentInSeasonSportsStore',
  state: () => ({
     currentSports: [] as IcurrentInSeasonSportData[],
     loading: true,
     errored: false,
  }),

  actions: {
    async fetchSports() {
      this.loading = true;
      try {
        const response = await axios.get(`https://api.the-odds-api.com/v4/sports/?apiKey=c1f97b82364f6a814a166ec0bf70f02e`);
        this.currentSports = response.data;
      } catch (error) {
        console.error(error);
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
  },
});