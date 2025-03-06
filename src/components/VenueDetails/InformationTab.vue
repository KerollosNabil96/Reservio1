<template>
  <div>
    <!-- Venue Info and Booking Section -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
      <!-- About Venue Component -->
      <AboutVenue :current-venue="currentVenue" :full-address="fullAddress" />

      <!-- Booking Card -->
      <div
        class="col-span-1 md:col-span-5 transform transition-all duration-500 opacity-100 translate-y-0"
      >
        <div
          class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-xl relative overflow-hidden"
        >
          <div
            class="absolute -top-10 -right-10 w-24 h-24 bg-blue-200/5 dark:bg-blue-700/5 rounded-full blur-xl"
          ></div>
          <div
            class="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-200/5 dark:bg-indigo-700/5 rounded-full blur-xl"
          ></div>

          <h2
            class="text-xl font-semibold mb-6 text-blue-900 dark:text-blue-400 relative z-10"
          >
            <span class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Booking
            </span>
          </h2>

          <div class="flex items-baseline mb-6 relative z-10">
            <span class="text-green-500 dark:text-green-400 font-bold text-3xl"
              >{{ currentVenue.price }}EGP</span
            >
            <span class="text-gray-500 dark:text-gray-400 text-sm ml-2"
              >/ Hour</span
            >
          </div>

          <button
            @click="goToBooking"
            class="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] w-full text-center flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Book Now!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AboutVenue from "@/components/VenueDetails/AboutVenue.vue";

export default {
  name: "InformationTab",
  components: {
    AboutVenue,
  },
  props: {
    currentVenue: {
      type: Object,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
  },
  methods: {
    goToBooking() {
      this.$emit("book-now");
    },
  },
};
</script>
