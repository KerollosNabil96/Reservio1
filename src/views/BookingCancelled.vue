<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center"
    >
      <div
        class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Booking Cancelled
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Your payment was cancelled. No charges were made.
      </p>
      <div class="space-y-4">
        <button
          @click="tryAgain"
          class="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          @click="goHome"
          class="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";

export default {
  name: "BookingCancelled",
  data() {
    return {
      pendingBooking: null,
    };
  },
  created() {
    // Check if there's a pending booking in localStorage
    const storedBooking = localStorage.getItem("pendingBooking");
    if (storedBooking) {
      this.pendingBooking = JSON.parse(storedBooking);
    }
  },
  computed: {
    venue() {
      // First try to get venue from the stored booking
      if (this.pendingBooking && this.pendingBooking.venue) {
        return this.pendingBooking.venue;
      }
      // Fallback to Vuex state if available
      return store.state.currentBookingInfo?.venue || {};
    },
  },
  methods: {
    tryAgain() {
      const venueId = this.venue.id;
      if (venueId) {
        // Keep the booking info in localStorage for retry
        this.$router.push(`/booking-info/${venueId}`);
      } else {
        // If no venue ID (e.g., if user accessed page directly), go to book now
        this.$router.push("/book-now");
        // Clear localStorage if we're going back to search
        localStorage.removeItem("pendingBooking");
      }
    },
    goHome() {
      // Clear localStorage when going back to home
      localStorage.removeItem("pendingBooking");
      this.$router.push("/");
    },
  },
};
</script>
