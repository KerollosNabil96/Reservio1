import { createStore } from "vuex";

const store = createStore({
  state: {
    userName: {
      name: '', 
      email: '',
      phone: '',
    },
    isDarkMode: true,
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
  },
  mutations: {
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
      }else {
        state.user = { name: fullName, email: '', phone: '' }; 
      }
    },
    updateUserProfile(state, userData) {
      state.user = { ...state.user, ...userData };
  }
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
  },
});

export default store;
