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
        Registration Cancelled
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Your venue registration was cancelled. No charges were made.
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
  name: "RegistrationCancelled",
  methods: {
    tryAgain() {
      // Go back to venue registration form
      this.$router.push("/register-venue");
    },
    goHome() {
      // Clear any stored form data
      store.state.myFormData = null;
      this.$router.push("/");
    },
  },
};
</script>
