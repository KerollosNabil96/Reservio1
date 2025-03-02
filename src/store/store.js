import { createStore } from "vuex";

const store = createStore({
  state: {
    isDarkMode: false,
    reservations: [
      {
        id: 1,
        name: "Football field",
        description: "Spacious football field with changing rooms.",
        image:
          "https://m.media-amazon.com/images/I/71+P-+MRm8L._AC_UF894,1000_QL80_.jpg",
        price: 100,
      },
      {
        id: 2,
        name: "Basketball Court",
        description: "Indoor court suitable for multiple sports.",
        image:
          "https://m.media-amazon.com/images/I/71+P-+MRm8L._AC_UF894,1000_QL80_.jpg",
        price: 80,
      },
      {
        id: 3,
        name: "Conference Hall",
        description: "Perfect for business meetings and seminars.",
        image:
          "https://m.media-amazon.com/images/I/71+P-+MRm8L._AC_UF894,1000_QL80_.jpg",
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
