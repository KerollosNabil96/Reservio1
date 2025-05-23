import { createStore } from "vuex";
import { db, ref, get, onValue } from "@/firebase"; // Add get here

const store = createStore({
  state: {
    user: {
      name: "",
      email: "",
      phone: "",
      notifications: [], // Add notifications array to user object
    },
    showErrorDialog: false,
    isDarkMode: localStorage.getItem("theme") === "dark", // Initialize from localStorage
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
    selectedTimeSlotId: "0", // Default to "0" or set dynamically
    currentLocale: localStorage.getItem("locale") || "en", // Add locale state, load from localStorage
  },
  mutations: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
      const theme = state.isDarkMode ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme); // Apply theme to document
      localStorage.setItem("theme", theme); // Save to localStorage
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
    setSelectedTimeSlotId(state, timeSlotId) {
      state.selectedTimeSlotId = timeSlotId; // Mutation to update the selected time slot ID
    },
    setLocale(state, locale) {
      // Add mutation for locale
      state.currentLocale = locale;
      localStorage.setItem("locale", locale); // Save to localStorage
      // Optionally update i18n instance here if it's accessible, or handle in action/component
      // i18n.global.locale = locale; // Example, needs i18n instance
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
    initializeTheme({ state }) {
      const savedTheme = localStorage.getItem("theme") || "light";
      state.isDarkMode = savedTheme === "dark";
      document.documentElement.setAttribute("data-theme", savedTheme); // Apply theme on initialization
    },
    setLocale({ commit }, locale) {
      // Add action for locale
      commit("setLocale", locale);
      // If i18n instance isn't directly available, trigger update in component or main.js
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
          case "price_asc":
            // Sort by price (lowest first)
            filteredVenues = filteredVenues.sort((a, b) => {
              // Ensure we're comparing numbers and handle missing prices
              const priceA = a.price !== undefined ? Number(a.price) : 0;
              const priceB = b.price !== undefined ? Number(b.price) : 0;
              return priceA - priceB;
            });
            break;
          case "price_desc":
            // Sort by price (highest first)
            filteredVenues = filteredVenues.sort((a, b) => {
              // Ensure we're comparing numbers and handle missing prices
              const priceA = a.price !== undefined ? Number(a.price) : 0;
              const priceB = b.price !== undefined ? Number(b.price) : 0;
              return priceB - priceA;
            });
            break;
        }
      }

      return filteredVenues;
    },
    addNotification(state, notification) {
      if (state.user) {
        if (!state.user.notifications) {
          state.user.notifications = [];
        }
        state.user.notifications.unshift(notification);
      }
    },
    markNotificationAsRead(state, notificationId) {
      if (state.user && state.user.notifications) {
        const notification = state.user.notifications.find(
          (n) => n.id === notificationId
        );
        if (notification) {
          notification.read = true;
        }
      }
    },
    getSelectedTimeSlotId: (state) => state.selectedTimeSlotId, // Add this getter
    getCurrentLocale: (state) => state.currentLocale, // Add getter for locale
  },
});

export default store;
