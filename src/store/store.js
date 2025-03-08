import { createStore } from "vuex";
import { db, ref, get, onValue } from "@/firebase"; // Add get here

const store = createStore({
  state: {
    user: {
      name: "",
      email: "",
      phone: "",
    },
    isDarkMode: JSON.parse(localStorage.getItem("DarkMode")) || true,
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
      sortBy: "rating", // Default sort by rating
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
    setSortBy(state, sortBy) {
      state.searchFilters.sortBy = sortBy;
    },
    updateVenueAverageRating(state, { venueId, averageRating, totalReviews }) {
      const venue = state.reservations.find((v) => v.id === venueId);
      if (venue) {
        venue.averageRating = averageRating;
        venue.totalReviews = totalReviews;
      }
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
    async fetchVenues({ commit, dispatch }) {
      try {
        commit("setLoading", true);
        const { venues, error } = await getVenues();

        if (error) {
          throw new Error(error.message || "Failed to fetch venues");
        }

        // Replace the hardcoded venues with ones from Firebase
        if (venues && venues.length > 0) {
          commit("setReservations", venues);

          // Calculate average ratings for all venues
          dispatch("calculateAllVenueRatings");
        }

        return { venues, error: null };
      } catch (error) {
        return { venues: [], error: error.message };
      } finally {
        commit("setLoading", false);
      }
    },
    async calculateAllVenueRatings({ state, commit }) {
      try {
        // Process each venue to get its ratings
        for (const venue of state.reservations) {
          if (!venue.id) continue;

          const reviewsRef = ref(db, `venues/${venue.id}/reviews`);
          const snapshot = await get(reviewsRef);

          if (snapshot.exists()) {
            const reviews = snapshot.val();
            const reviewsArray = Object.values(reviews);
            const totalReviews = reviewsArray.length;

            if (totalReviews > 0) {
              const sum = reviewsArray.reduce(
                (acc, review) => acc + review.rating,
                0
              );
              const averageRating = sum / totalReviews;

              // Update the venue with its calculated average rating
              commit("updateVenueAverageRating", {
                venueId: venue.id,
                averageRating,
                totalReviews,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error calculating venue ratings:", error);
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
    getTopRatedVenues(state) {
      // Create a copy of the venues to avoid modifying the original array
      const venuesCopy = [...state.reservations];

      // Sort venues by average rating in descending order using the improved comparison
      return venuesCopy
        .sort((a, b) => {
          // Ensure we're comparing numbers and handle missing ratings
          const ratingA =
            a.averageRating !== undefined ? Number(a.averageRating) : 0;
          const ratingB =
            b.averageRating !== undefined ? Number(b.averageRating) : 0;
          return ratingB - ratingA;
        })
        .slice(0, 6); // Return only the top 6
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

      // Sort results based on sortBy
      if (state.searchFilters.sortBy) {
        const sortBy = state.searchFilters.sortBy;

        switch (sortBy) {
          case "rating":
            // Sort by rating (highest first)
            filteredVenues = filteredVenues.sort((a, b) => {
              // Ensure we're comparing numbers and handle missing ratings
              const ratingA =
                a.averageRating !== undefined ? Number(a.averageRating) : 0;
              const ratingB =
                b.averageRating !== undefined ? Number(b.averageRating) : 0;
              return ratingB - ratingA;
            });
            break;
          case "nearest":
            // Sort by nearest date to today
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to beginning of day for fair comparison

            filteredVenues = filteredVenues.sort((a, b) => {
              const dateA = a.selectedDate
                ? new Date(a.selectedDate)
                : new Date(0);
              const dateB = b.selectedDate
                ? new Date(b.selectedDate)
                : new Date(0);

              // Calculate absolute difference from today
              const diffA = Math.abs(dateA - today);
              const diffB = Math.abs(dateB - today);

              return diffA - diffB; // Nearest first
            });
            break;
          case "furthest":
            // Sort by furthest date from today
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0); // Reset time to beginning of day for fair comparison

            filteredVenues = filteredVenues.sort((a, b) => {
              const dateA = a.selectedDate
                ? new Date(a.selectedDate)
                : new Date(0);
              const dateB = b.selectedDate
                ? new Date(b.selectedDate)
                : new Date(0);

              // Calculate absolute difference from today
              const diffA = Math.abs(dateA - todayDate);
              const diffB = Math.abs(dateB - todayDate);

              return diffB - diffA; // Furthest first
            });
            break;
        }
      }

      return filteredVenues;
    },
  },
});

export default store;
