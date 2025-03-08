import { createStore } from "vuex";

const store = createStore({
  state: {
    user: {
      name: "",
      email: "",
      phone: "",
    },
    isDarkMode: JSON.parse(localStorage.getItem("DarkMode")) || false,
    showSignup: false,
    showSignin: false,
    user: null,
    isAuthenticated: false,
    authError: null,
    isLoading: false,
    myFormData: {},
    selectedVenue: null,
    reservations: [],
    currentBookingInfo: null,
    searchFilters: {
      query: "",
      date: null,
      category: "",
      location: "",
    },
  },
  mutations: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("DarkMode", state.isDarkMode); // Save to localStorage
    },
    addReservation(state, payload) {
      state.reservations.push(payload);
    },

    setReservations(state, venues) {
      state.reservations = venues;
    },
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    setAuthError(state, error) {
      state.authError = error;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setShowSignup(state, value) {
      state.showSignup = value;
    },
    setShowSignin(state, value) {
      state.showSignin = value;
    },
    setMyFormData(state, Data) {
      state.myFormData = Data;
    },
    setVenuePictures(state, venue) {
      state.selectedVenue = venue;
    },
    updateUserName(state, fullName) {
      if (state.user) {
        state.user.name = fullName;
      } else {
        state.user = { name: fullName, email: "", phone: "" };
      }
    },
    updateUserProfile(state, userData) {
      state.user = { ...state.user, ...userData };
    },
    updateUserPhone(state, newPhone) {
      state.user.phone = newPhone;
    },
    updateVenueRating(state, { venueId, rating }) {
      const venue = state.reservations.find((v) => v.id === venueId);
      if (venue) {
        if (!venue.totalRatings) venue.totalRatings = 0;
        if (!venue.ratingSum) venue.ratingSum = 0;

        venue.totalRatings++;
        venue.ratingSum += rating;
        venue.averageRating = venue.ratingSum / venue.totalRatings;
      }
    },
    setSearchFilters(state, filters) {
      state.searchFilters = { ...state.searchFilters, ...filters };
    },
  },
  actions: {
    async addReservation({ commit, state }, payload) {
      try {
        // Save venue to Firebase Realtime Database
        const { id, error } = await addVenue(payload);

        if (error) {
          throw new Error(error.message || "Failed to save venue");
        }

        // Add to local state with the ID from Firebase
        const venueWithId = { ...payload, id };
        commit("addReservation", venueWithId);

        return { id, error: null };
      } catch (error) {
        return { id: null, error: error.message };
      }
    },
    async fetchVenues({ commit }) {
      try {
        commit("setLoading", true);
        const { venues, error } = await getVenues();

        if (error) {
          throw new Error(error.message || "Failed to fetch venues");
        }

        // Replace the hardcoded venues with ones from Firebase
        if (venues && venues.length > 0) {
          commit("setReservations", venues);
        }

        return { venues, error: null };
      } catch (error) {
        return { venues: [], error: error.message };
      } finally {
        commit("setLoading", false);
      }
    },
    async initAuth({ commit, dispatch }) {
      try {
        commit("setLoading", true);
        const user = await getCurrentUser();
        commit("setUser", user);

        // Fetch venues after authentication
        if (user) {
          await dispatch("fetchVenues");
        }
      } catch (error) {
        commit("setAuthError", error.message);
      } finally {
        commit("setLoading", false);
      }
    },
    updateAuthState({ commit }, user) {
      commit("setUser", user);
    },
    setLoadingState({ commit }, isLoading) {
      commit("setLoading", isLoading);
    },
    async updateVenueRating({ commit }, { venueId, rating }) {
      try {
        commit("updateVenueRating", { venueId, rating });
      } catch (error) {
        console.error("Error updating venue rating:", error);
      }
    },
  },
  getters: {
    getReservations(state) {
      return state.reservations;
    },
    getVenueById(state) {
      return (id) => {
        return state.reservations.find((venue) => venue.id == id);
      };
    },
    getSelectedVenue(state) {
      return state.selectedVenue;
    },
    isAuthenticated: (state) => state.isAuthenticated,
    getVenueRating: (state) => (venueId) => {
      const venue = state.reservations.find((v) => v.id === venueId);
      return venue ? venue.averageRating || 0 : 0;
    },
    getFilteredVenues(state) {
      let filteredVenues = state.reservations;

      // Filter by search query (search in name and description)
      if (state.searchFilters.query) {
        const searchQuery = state.searchFilters.query.toLowerCase();
        filteredVenues = filteredVenues.filter(
          (venue) =>
            venue.venueName.toLowerCase().includes(searchQuery) ||
            (venue.shortDescription &&
              venue.shortDescription.toLowerCase().includes(searchQuery)) ||
            (venue.longDescription &&
              venue.longDescription.toLowerCase().includes(searchQuery))
        );
      }

      // Filter by category
      if (state.searchFilters.category) {
        filteredVenues = filteredVenues.filter(
          (venue) => venue.category === state.searchFilters.category
        );
      }

      // Filter by location
      if (state.searchFilters.location) {
        filteredVenues = filteredVenues.filter(
          (venue) =>
            venue.address && venue.address.city === state.searchFilters.location
        );
      }

      // Filter by date (This depends on how dates are stored in your venue objects)
      if (state.searchFilters.date) {
        const searchDate = new Date(state.searchFilters.date).setHours(
          0,
          0,
          0,
          0
        );
        filteredVenues = filteredVenues.filter((venue) => {
          // If the venue has availableDates, check if the search date is included
          if (venue.availableDates && Array.isArray(venue.availableDates)) {
            return venue.availableDates.some(
              (date) => new Date(date).setHours(0, 0, 0, 0) === searchDate
            );
          }
          // If the venue has a selectedDate field
          if (venue.selectedDate) {
            return (
              new Date(venue.selectedDate).setHours(0, 0, 0, 0) === searchDate
            );
          }
          return true; // Include venues without date information
        });
      }

      return filteredVenues;
    },
  },
});

export default store;
