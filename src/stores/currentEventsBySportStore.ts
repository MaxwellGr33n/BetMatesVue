import { defineStore } from 'pinia';
import axios from 'axios';

export interface IcurrentEventBySportData {
  id: string;
  sports_key: string;
  sports_title: string;
  sports_icon?: string;
  commence_time: string;
  time_to_commence: string;
  interval_id?: NodeJS.Timeout | null;
  home_team: string;
  away_team: string;
  text?: string;
  active?: boolean;
  isClicked?: boolean;
}

export const useCurrentEventsBySportStore = defineStore({
 id: 'currentEventBySport',
 state: () => ({
    currentEvents: [] as IcurrentEventBySportData[],
    loading: true,
    errored: false,
 }),
 actions: {
    async fetchEvents(sport: string) {
      this.loading = true;
      try {
        const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/events/?apiKey=c1f97b82364f6a814a166ec0bf70f02e`);
        this.currentEvents = response.data;

        switch(sport) {
          case 'aussierules_afl': 
            for (const event of this.currentEvents) {
            event.sports_icon = 'mdi:football-australian';
          } break;
        }
      
      } catch (error) {
        console.error(error);
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    startCountdown(eventId: string) {
      if (!this.currentEvents.length) {
        console.log("No events available. Please fetch events first.");
        return;
      }

      const event = this.currentEvents.find(item => item.id === eventId);
      if (!event || !event.commence_time) return;

      const countdown = () => {
        const now = new Date();
        const start = new Date(event.commence_time);
        const timeRemaining = start.getTime() - now.getTime();

        let newTimeToCommence = "";

        if (timeRemaining <= -90 * 60 * 1000) {
          newTimeToCommence = "";
          if (event.interval_id) clearInterval(event.interval_id);
          event.interval_id = null;
          return;
        }

        if (timeRemaining <= 0) {
          newTimeToCommence = "Live";
          return;
        }

        if (timeRemaining < 15 * 60 * 1000) { 
          const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

          let timeString = "";
          if (minutes > 0) {
            timeString += `${minutes.toString()}m`;
          }
          if (seconds >= 0) {
            timeString += ` ${seconds.toString().padStart(2, "0")}s`;
          }
          newTimeToCommence = timeString;
        }
        else {
          if (event.interval_id) clearInterval(event.interval_id);
          event.interval_id = null;
          console.log("reset timer");
        }
        this.updateEventTimeToCommence(eventId, newTimeToCommence);
      };

      countdown(); // Initial countdown
      event.interval_id = setInterval(countdown, 1000);
    },
    updateEventTimeToCommence(eventId: string, newTimeToCommence: string) {
      const eventIndex = this.currentEvents.findIndex(item => item.id === eventId);
      if (eventIndex !== -1) {
        this.currentEvents[eventIndex].time_to_commence = newTimeToCommence;
      }
    },
 },
});
