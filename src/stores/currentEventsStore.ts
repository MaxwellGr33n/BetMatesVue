import { defineStore } from 'pinia';
import axios from 'axios';

export interface IOutcome {
 name: string;
 price: number;
}

export interface IMarket {
 key: string;
 outcomes: IOutcome[];
}

export interface IBookmaker {
 key: string;
 title: string;
 last_update: string; // ISO 8601
 markets: IMarket[];
}

/**
 * Interface for current event by sport data.
 */
export interface IcurrentEventsData {
  id: string;
  sports_key: string;
  sports_title: string;
  sports_icon?: string;
  commence_time: string; //ISO 8601
  time_to_commence: string;
  interval_id?: NodeJS.Timeout | null;
  home_team: string;
  away_team: string;
  text?: string;
  active?: boolean;
  isClicked?: boolean;
  bookmakers?: IBookmaker[];
}

/**
 * Store for managing current events by sport.
 */
export const useCurrentEventsStore = defineStore({
 id: 'currentEventsStore',
 state: () => ({
    currentEvents: {} as Record<string, IcurrentEventsData[]>,
    loading: true,
    errored: false,
    filteredEvents: [] as IcurrentEventsData[],
 }),
 actions: {

    /**
     * Fetches events and odds for a given sport. This API call has a cost of 1
     * @param {string} sport - The sport for which to fetch events.
     */
    async ApiGetEventsWithOdds(sport: string) {
      try {
        if (!this.currentEvents[sport]) {
          const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=au&markets=h2h&dateFormat=iso&oddsFormat=decimal&bookmakers=ladbrokes_au%2Cneds%2Csportsbet%2Cunibet%2Ctab`); //prod ready call
          // const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${import.meta.env.VITE_ODDS_API_KEY}&regions=au&markets=h2h&dateFormat=iso&oddsFormat=decimal&bookmakers=ladbrokes_au%2Cneds%2Csportsbet%2Cunibet%2Ctab`);
          this.currentEvents[sport] = response.data;
        }

        for (const event of this.currentEvents[sport]) {
          switch (sport) {
            case 'aussierules_afl':
            event.sports_icon = 'mdi:football-australian';
            break;
            case 'rugbyleague_nrl':
            event.sports_icon = 'material-symbols:sports-rugby';
            break;
            case 'americanfootball_nfl':
            event.sports_icon = 'ion:american-football';
            break;
            case 'soccer_australia_aleague':
            event.sports_icon = 'game-icons:soccer-ball';
            break;
            case 'baseball_mlb':
            event.sports_icon = 'ion:baseball';
            break;
            case 'basketball_nba':
            event.sports_icon = 'solar:basketball-bold';
            break;
          }
        }
      } catch (error) {
        console.error(error);
        this.errored = true;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Fetches events for a given sport. This API call has a cost of 0
     * @param {string} sport - The sport for which to fetch events.
     */
    async ApiGetEvents(sport: string) {
      try {
        if (!this.currentEvents[sport]) {
          const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/events?apiKey=${import.meta.env.VITE_ODDS_API_KEY}&dateFormat=iso`);
          this.currentEvents[sport] = response.data;
        }

        for (const event of this.currentEvents[sport]) {
          switch (sport) {
            case 'aussierules_afl':
            event.sports_icon = 'mdi:football-australian';
            break;
            case 'rugbyleague_nrl':
            event.sports_icon = 'material-symbols:sports-rugby';
            break;
            case 'americanfootball_nfl':
            event.sports_icon = 'ion:american-football';
            break;
            case 'soccer_australia_aleague':
            event.sports_icon = 'game-icons:soccer-ball';
            break;
            case 'baseball_mlb':
            event.sports_icon = 'ion:baseball';
            break;
            case 'basketball_nba':
            event.sports_icon = 'solar:basketball-bold';
            break;
          }
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
    startCountdown(sport: string, eventId: string) {
      // Check if the sport events are available
      if (!this.currentEvents[sport]) {
        console.log("No events available for this sport. Please fetch events first.");
        return;
      }

      const event = this.currentEvents[sport].find((item: IcurrentEventsData) => item.id === eventId);
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
        console.log(eventId, newTimeToCommence);
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
      let eventFound = false;
      for (const sportEvents of Object.values(this.currentEvents)) {
        const eventIndex = sportEvents.findIndex(item => item.id === eventId);
        if (eventIndex !== -1) {
          eventFound = true;
          sportEvents[eventIndex].time_to_commence = newTimeToCommence;
          console.log(sportEvents[eventIndex] + "Found");
          break; // Exit the loop once the event is found and updated
        }
        else if (!eventFound) {
          console.log("Event not found. Please fetch events first.");
        }
      }
    },

    findNextClosestEvent(): IcurrentEventsData | null {
      const now = new Date().toISOString();
     
      let nextClosestEvent: IcurrentEventsData | null = null;
      let minTimeDifference = Infinity;
     
      for (const sportEvents of Object.values(this.currentEvents)) {
         for (const event of sportEvents) {
           const eventTime = new Date(event.commence_time);
           const timeDifference = eventTime.getTime() - new Date(now).getTime();
     
           if (timeDifference > 0 && timeDifference < minTimeDifference) {
             minTimeDifference = timeDifference;
             nextClosestEvent = event;
           }
       }
      }
      return nextClosestEvent;
    },

    fetchEventsbySport(sport: string): IcurrentEventsData[] | null {
      if (this.currentEvents[sport]) {
        return this.currentEvents[sport];
      } else {
        console.log("not found yet");
        return null;
      }
    },

    /**
     * Fetches an event instance by its ID.
     * @param {string} eventId - The ID of the event to fetch.
     * @returns {IcurrentEventsData | null} The event instance if found, otherwise null.
     */
    fetchEventById(eventId: string): IcurrentEventsData | null {
      let eventFound: IcurrentEventsData | null = null;
      // Iterate over all sports events
      for (const sportEvents of Object.values(this.currentEvents)) {
        const event = sportEvents.find(item => item.id === eventId);
        if (event) {
          eventFound = event;
          break; 
        }
      }
      return eventFound;
    },

    updateFilteredEvents(sport: string) {
      if (this.currentEvents[sport]) {
        this.filteredEvents = this.currentEvents[sport] || [];
      }
      else {
        console.log("not found yet");
        return null;
      }
    },

    formatTime(isoTime: string, toFormatEvent: boolean): string {
        const date = new Date(isoTime);
        const now = new Date();

        // Check if the event's commence time is before the current time
        if (toFormatEvent && date < now) {
            return "LIVE";
        }

        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const day = date.getDate();
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                        day % 10 === 2 && day !== 12 ? 'nd' :
                        day % 10 === 3 && day !== 13 ? 'rd' : 'th';
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        return `${weekday} ${day}${suffix} ${hour}:${minute}`;
    }
 },
});
