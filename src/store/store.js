import { createStore } from "vuex";
// Import the reviewer image
import reviewerImage from "../assets/pictures/reviewer.svg";

const store = createStore({
  state: {
    isDarkMode: false,
    showSignup: false,
    showSignin: false,
    reservations: [
      {
        id: 0,
        owner: "Hazem",
        name: "Liverpool football field",
        shortDescription: "A great football field with many facilities",
        longDescription: `A football field is a rectangular playing surface,
         typically 120 yards long and 53.3 yards wide,
          including two 10-yard end zones at each end. 
          The field is marked with white lines every 5 yards, with numbered yard lines (10, 20, 30, etc.) 
          indicating distance from each end zone. The 50-yard line divides the field into two equal halves. Goalposts, consisting of a crossbar and two uprights, 
          are centered at the back of each end zone. The field is usually made of natural grass or artificial turf, surrounded by team benches, spectator stands, and boundary markers.
          It is the stage for intense competition, strategy, and athleticism.`,
        price: 200,
        pictures: [
          "https://www.soccer-field.net/images/fields/6/3.jpg?v=1",
          "https://www.soccer-field.net/images/fields/6/1.jpg?v=1",
          "https://www.soccer-field.net/images/fields/6/2.jpg?v=1",
        ],
        reviews: [
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
        ],
      },
      // Second reservation
      {
        id: 2,
        owner: "Hazem",
        name: "Liverpool football field",
        shortDescription: "A great football field with many facilities",
        longDescription: `A football field is a rectangular playing surface,
         typically 120 yards long and 53.3 yards wide,
          including two 10-yard end zones at each end. 
          The field is marked with white lines every 5 yards, with numbered yard lines (10, 20, 30, etc.) 
          indicating distance from each end zone. The 50-yard line divides the field into two equal halves. Goalposts, consisting of a crossbar and two uprights, 
          are centered at the back of each end zone. The field is usually made of natural grass or artificial turf, surrounded by team benches, spectator stands, and boundary markers.
          It is the stage for intense competition, strategy, and athleticism.`,
        price: 150,
        pictures: [
          "https://www.soccer-field.net/images/fields/6/3.jpg?v=1",
          "https://www.soccer-field.net/images/fields/6/1.jpg?v=1",
          "https://www.soccer-field.net/images/fields/6/2.jpg?v=1",
        ],
        reviews: [
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
        ],
      },
      // Third reservation
      {
        id: 3,
        owner: "Hazem",
        name: "Liverpool football field",
        shortDescription: "A great football field with many facilities",
        longDescription: `A football field is a rectangular playing surface,
         typically 120 yards long and 53.3 yards wide,
          including two 10-yard end zones at each end. 
          The field is marked with white lines every 5 yards, with numbered yard lines (10, 20, 30, etc.) 
          indicating distance from each end zone. The 50-yard line divides the field into two equal halves. Goalposts, consisting of a crossbar and two uprights, 
          are centered at the back of each end zone. The field is usually made of natural grass or artificial turf, surrounded by team benches, spectator stands, and boundary markers.
          It is the stage for intense competition, strategy, and athleticism.`,
        price: 250,
        pictures: [
          "https://www.soccer-field.net/images/fields/6/3.jpg?v=1",
          "https://www.soccer-field.net/images/fields/6/1.jpg?v=1",
          "https://www.soccer-field.net/images/fields/6/2.jpg?v=1",
        ],
        reviews: [
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
          {
            userPic: reviewerImage,
            username: "Kareem",
            message: "a really nice place, we had a great time playing there!",
          },
        ],
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
    getVenueById(state) {
      return (id) => {
        return state.reservations.find((venue) => venue.id == id);
      };
    },
  },
});

export default store;
