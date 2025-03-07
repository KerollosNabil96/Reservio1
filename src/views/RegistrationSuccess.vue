<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-gray-800"
  >
    <div
      class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md dark:bg-gray-900"
    >
      <div class="text-center">
        <div
          class="bg-green-100 mx-auto flex items-center justify-center w-20 h-20 rounded-full dark:bg-green-900 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Registration Successful!
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Your venue has been successfully registered. Our team will review your
          submission. If approved, your venue will be added to the platform.
        </p>

        <div class="border-t border-gray-200 pt-6 mt-6 dark:border-gray-700">
          <h3
            class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4"
          >
            Registration Details
          </h3>

          <div class="text-left">
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-medium">Venue Name:</span> {{ venueName }}
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-medium">Category:</span> {{ venueCategory }}
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-medium">Registration Date:</span>
              {{ formattedDate }}
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              <span class="font-medium">Status: </span>
              <span class="text-orange-400 font-semibold"
                >Pending Approval</span
              >
            </p>
          </div>
        </div>

        <div class="mt-8">
          <button
            @click="goHome"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { onValue, ref, set } from "firebase/database";

export default {
  name: "RegistrationSuccess",
  data() {
    return {
      venueName: "",
      venueCategory: "",
      registrationDate: new Date(),
    };
  },
  computed: {
    formattedDate() {
      return this.registrationDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
  mounted() {
    // Try to get venue data from localStorage first
    const storedVenue = localStorage.getItem("pendingVenueRegistration");
    if (storedVenue) {
      const venueData = JSON.parse(storedVenue);
      this.venueName = venueData.name || venueData.venueName || "Not available";
      this.venueCategory = venueData.category || "Not available";
    } else if (store.state.myFormData) {
      // Fallback to store if localStorage is empty
      const venueData = store.state.myFormData;
      this.venueName = venueData.name || venueData.venueName || "Not available";
      this.venueCategory = venueData.category || "Not available";
    }

    const userBalanceRef = ref(`/users/${store.state.user.id}/balance`);

    onValue(
      userBalanceRef,
      (snapshot) => {
        const balance = snapshot.val();
        set(userBalanceRef, balance + 200 * 0.05);
      },
      { onlyOnce: true }
    );
  },
};
</script>
