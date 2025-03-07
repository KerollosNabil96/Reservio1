<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center"
    >
      <div
        class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Registration Successful!
      </h2>

      <div
        v-if="venueData"
        class="mb-6 text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
      >
        <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          Venue Details
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Name:</span>
          {{ venueData.venueName }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Category:</span>
          {{ venueData.category }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Location:</span>
          {{ venueData.address?.city }}, {{ venueData.address?.governorate }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Status: </span>
          <span class="text-orange-400 font-semibold">Pending Approval</span>
        </p>
      </div>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Thank you for registering your venue with Reservio! Our team will review
        your submission and, if approved, your venue will be added to the
        platform.
      </p>
      <button
        @click="goHome"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </button>
    </div>
  </div>
</template>

<script>
import { db, ref, set } from "@/firebase";
import store from "@/store/store";

export default {
  name: "RegistrationSuccess",
  data() {
    return {
      venueData: null,
    };
  },
  created() {
    // First try to get venue data from localStorage
    const storedVenue = localStorage.getItem("pendingVenueRegistration");
    if (storedVenue) {
      this.venueData = JSON.parse(storedVenue);
    } else {
      // Fallback to store if localStorage is empty
      this.venueData = store.state.myFormData;
    }

    if (this.venueData) {
      // Save venue data to database
      this.saveVenueToDatabase();
    }
  },
  methods: {
    async saveVenueToDatabase() {
      try {
        // Add payment status and timestamp
        const venueWithStatus = {
          ...this.venueData,
          status: "pending",
          registrationDate: new Date().toISOString(),
          paymentStatus: "paid",
          paymentDate: new Date().toISOString(),
        };

        // Save to requests collection
        const requestRef = ref(db, `requests/${this.venueData.id}`);
        await set(requestRef, venueWithStatus);

        // Also save reference to user's pending venues
        if (store.state.user?.id) {
          const userVenueRef = ref(
            db,
            `users/${store.state.user.id}/pendingVenues/${this.venueData.id}`
          );
          await set(userVenueRef, {
            venueId: this.venueData.id,
            status: "pending",
            registrationDate: new Date().toISOString(),
            paymentStatus: "paid",
            paymentDate: new Date().toISOString(),
          });
        }

        // Clear the stored data
        localStorage.removeItem("pendingVenueRegistration");
        store.state.myFormData = null;
      } catch (error) {
        console.error("Error saving venue data:", error);
      }
    },
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>
