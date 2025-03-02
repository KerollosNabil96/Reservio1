<template>
  <div
    class="min-h-screen w-full bg-white text-gray-800 font-sans flex flex-col dark:bg-gray-800 dark:text-white"
  >
    <div class="w-full md:w-11/12 md:mx-auto">
      <!-- Hero Section -->
      <TheHeader />

      <!-- Search Box -->
      <SearchBox />
      <!-- Available Reservations Section -->
      <section class="mt-12 px-6 md:px-16">
        <ReservationCardList />
      </section>
    </div>
    <!-- Footer -->
  </div>
</template>

<script>
import SearchBox from "@/components/homepage/SearchBox.vue";
import TheHeader from "@/components/homepage/TheHeader.vue";
import ReservationCardList from "@/components/reservations/ReservationCardList.vue";

// Import your custom component here
export default {
  name: "Home",
  components: {
    ReservationCardList,
    TheHeader,
    SearchBox,
  },
  data() {
    return {
      // Example reservation data you might pass to ReservationCardList
      reservations: [
        {
          id: 1,
          name: "Football field",
          description: "Spacious football field with changing rooms.",
          image: "https://via.placeholder.com/300x200?text=Football+Field",
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
    };
  },
  methods: {
    sendMessage() {
      // Handle form submission
      alert("Message sent!");
    },
  },
};
</script>

<style scoped>
/* Tailwind handles most styling; add overrides if needed */
</style>
