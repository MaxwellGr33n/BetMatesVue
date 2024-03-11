import { defineStore } from 'pinia';
import axios from 'axios';

export interface IsportsData {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export const usesportsStore = defineStore({
 id: 'sports',
 state: () => ({
    sportsData: [] as IsportsData[],
    loading: true,
    errored: false,
 }),
 actions: {
    async fetchsports() {
      this.loading = true;
      try {
        const response = await axios.get(`https://api.the-odds-api.com/v4/sports/?apiKey=c1f97b82364f6a814a166ec0bf70f02e`)
        this.sportsData = response.data;
      } catch (error) {
        console.error(error);
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
 },
});
