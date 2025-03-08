<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-gray-800"
  >
    <div
      class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md dark:bg-gray-900"
    >
      <div class="text-center">
        <div
          class="bg-red-100 mx-auto flex items-center justify-center w-20 h-20 rounded-full dark:bg-red-900 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Cancelled
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Your venue registration payment was cancelled or failed.
          <span v-if="cashbackReverted" class="block mt-2 text-red-500">
            The previously applied cashback has been reversed.
          </span>
        </p>

        <div class="mt-8">
          <button
            @click="goBack"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            @click="goHome"
            class="w-full mt-4 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
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
import { getDatabase, ref, get, set } from "firebase/database";

export default {
  name: "RegistrationCancelled",
  data() {
    return {
      cashbackReverted: false,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    goHome() {
      this.$router.push("/");
    },
    async revertCashback() {
      // Only revert if cashback was applied
      if (localStorage.getItem("cashbackApplied") !== "true") {
        console.log("No cashback to revert");
        return;
      }

      if (!store.state.user?.id) {
        console.error("No user found, cannot revert cashback");
        return;
      }

      try {
        const db = getDatabase();
        const userBalanceRef = ref(db, `users/${store.state.user.id}/balance`);

        // Get current balance
        const snapshot = await get(userBalanceRef);
        if (snapshot.exists()) {
          const currentBalance = snapshot.val() || 0;
          const cashbackAmount = 200 * 0.05; // 5% of 200 EGP

          // Deduct the cashback from balance
          const newBalance = currentBalance - cashbackAmount;
          await set(userBalanceRef, newBalance);

          console.log(
            `Reverted ${cashbackAmount} EGP cashback. New balance: ${newBalance} EGP`
          );
          this.cashbackReverted = true;

          // Clear the flag
          localStorage.removeItem("cashbackApplied");
        }
      } catch (error) {
        console.error("Error reverting cashback:", error);
      }
    },
  },
  async mounted() {
    // Revert cashback if payment was cancelled
    await this.revertCashback();

    // Clean up stored data
    localStorage.removeItem("pendingVenueRegistration");
  },
};
</script>
