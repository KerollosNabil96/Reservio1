import { createStore } from "vuex";

const store = createStore({
  state: {
    isDarkMode: false,
    reservations: [
      {
        id: 1,
        name: "Football field",
        description: "Spacious football field with changing rooms.",
        image: "../assets/pictures/Screenshot 2025-03-01 185349.png",
        price: 100,
      },
      {
        id: 2,
        name: "Basketball Court",
        description: "Indoor court suitable for multiple sports.",
        image: "https://via.placeholder.com/300x200?text=Basketball+Court",
        price: 80,
      },
      {
        id: 3,
        name: "Conference Hall",
        description: "Perfect for business meetings and seminars.",
        image: "https://via.placeholder.com/300x200?text=Conference+Hall",
        price: 150,
      },
    ],
  },
  mutations: {
    addReservation(state, payload) {
      state.reservations.push(payload);
    },
  },
  actions: {
    addReservation(context, payload) {
      context.commit("addReservation", payload);
    },
  },
  getters: {
    getReservations(state) {
      return state.reservations;
    },
  },
});

export default store;
