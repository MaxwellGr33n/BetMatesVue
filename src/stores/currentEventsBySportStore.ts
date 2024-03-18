import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Interface for current event by sport data.
 */
export interface IcurrentEventBySportData {
  id: string;
  sports_key: string;
  sports_title: string;
  sports_icon?: string;
  commence_time: string;
  time_to_commence: string;
  interval_id?: NodeJS.Timeout | null;
  home_team: string;
  home_team_icon: string;
  away_team: string;
  text?: string;
  active?: boolean;
  isClicked?: boolean;
}

/**
 * Store for managing current events by sport.
 */
export const useCurrentEventsBySportStore = defineStore({
 id: 'currentEventBySport',
 state: () => ({
    currentEvents: [] as IcurrentEventBySportData[],
    loading: true,
    errored: false,
 }),
 actions: {
    /**
     * Fetches events for a given sport. This API call has no cost
     * @param {string} sport - The sport for which to fetch events.
     */
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
          case 'rugbyleague_nrl': 
            for (const event of this.currentEvents) {
            event.sports_icon = 'material-symbols:sports-rugby';
          } break;
          case 'americanfootball_nfl': 
            for (const event of this.currentEvents) {
            event.sports_icon = 'ion:american-football';
          } break;
          case 'soccer_efl_champ': 
            for (const event of this.currentEvents) {
            event.sports_icon = 'game-icons:soccer-ball';
          } break;
          case 'baseball_mlb': 
            for (const event of this.currentEvents) {
            event.sports_icon = 'ion:baseball';
          } break;
          case 'basketball_nba': 
            for (const event of this.currentEvents) {
            event.sports_icon = 'solar:basketball-bold';
          } break;
        }
      
      } catch (error) {
        console.error(error);
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Starts a countdown for a given event.
     * @param {string} eventId - The ID of the event to start the countdown for.
     */
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
    /**
     * Updates the time to commence for a given event.
     * @param {string} eventId - The ID of the event to update.
     * @param {string} newTimeToCommence - The new time to commence.
     */
    updateEventTimeToCommence(eventId: string, newTimeToCommence: string) {
      const eventIndex = this.currentEvents.findIndex(item => item.id === eventId);
      if (eventIndex !== -1) {
        this.currentEvents[eventIndex].time_to_commence = newTimeToCommence;
      }
    },
 },
});
