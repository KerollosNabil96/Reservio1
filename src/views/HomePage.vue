<template>
  <div
    class="min-h-screen w-full mx-auto bg-white text-gray-800 flex flex-col dark:bg-gray-800 dark:text-white"
  >
    <div class="w-full sm:w-10/12 mx-auto">
      <!-- Hero Section -->
      <TheHeader />

      <!-- Search Box -->
      <SearchBox />

      <!-- Available Reservations Section -->
      <section class="mt-12 px-6 md:px-16">
        <h2 class="text-2xl font-bold mb-6">Available Reservations</h2>
        <ReservationCardList />
      </section>
    </div>

    <!-- Footer -->
    <TheFooter />
  </div>
</template>

<script>
import SearchBox from "@/components/homepage/SearchBox.vue";
import TheFooter from "@/components/homepage/TheFooter.vue";
import TheHeader from "@/components/homepage/TheHeader.vue";
import ReservationCardList from "@/components/reservations/ReservationCardList.vue";
import store from "@/store/store";

export default {
  name: "Home",
  components: {
    ReservationCardList,
    TheHeader,
    SearchBox,
    TheFooter,
  },
  data() {
    return {
      date: null,
      category: null,
      location: null,
    };
  },
  methods: {
    sendMessage() {
      alert("Message sent!");
    },
    searchReservations() {
      const obj = {
        date: this.date,
        category: this.category,
        location: this.location,
      };
      console.log(obj);
    },
  },
  computed: {
    dark() {
      return store.state.isDarkMode;
    },
  },
  mounted() {
    console.log(store.state.isDarkMode);
  },
};
</script>
