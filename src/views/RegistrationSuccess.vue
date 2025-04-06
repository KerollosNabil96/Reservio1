<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6 relative"
  >
    <!-- Background pattern for dark mode -->
    <div
      class="absolute inset-0 overflow-hidden pointer-events-none dark:opacity-10 opacity-0"
    >
      <div
        class="absolute -top-24 -left-24 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slow"
      ></div>
      <div
        class="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slower"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-float"
      ></div>
    </div>

    <div class="max-w-md mx-auto relative z-10">
      <div
        class="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8"
      >
        <div class="text-center">
          <div
            class="bg-green-100 mx-auto flex items-center justify-center w-20 h-20 rounded-full dark:bg-green-900/50 mb-6"
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
            {{ $t("registrationSuccess.title") }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ $t("registrationSuccess.description") }}
            <span class="block mt-2">
              "You have also received
              <span class="text-green-500 font-bold"
                >{{ (200 * 0.05).toFixed(2) }} EGP</span
              >
              cashback from our loyalty program!"
            </span>
          </p>

          <div
            v-if="requestSubmitted"
            class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6"
          >
            <p class="text-blue-700 dark:text-blue-300">
              <span class="font-bold">{{
                $t("registrationSuccess.greatNews")
              }}</span>
              {{ $t("registrationSuccess.reviewMessage") }}
            </p>
          </div>

          <div class="border-t border-gray-200 pt-6 mt-6 dark:border-gray-700">
            <h3
              class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4"
            >
              {{ $t("registrationSuccess.detailsTitle") }}
            </h3>

            <div class="text-left">
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <span class="font-medium"
                  >{{ $t("registrationSuccess.venueName") }}:</span
                >
                {{ venueName }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <span class="font-medium"
                  >{{ $t("registrationSuccess.category") }}:</span
                >
                {{ venueCategory }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <span class="font-medium"
                  >{{ $t("registrationSuccess.registrationDate") }}:</span
                >
                {{ formattedDate }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <span class="font-medium"
                  >{{ $t("registrationSuccess.paymentMethod") }}:</span
                >
                <span
                  class="font-medium"
                  :class="{
                    'text-blue-500': isCreditCardPayment,
                    'text-green-500': !isCreditCardPayment,
                  }"
                >
                  {{ paymentMethod }}
                </span>
              </p>
              <p class="text-gray-600 dark:text-gray-300 mb-2">
                <span class="font-medium"
                  >{{ $t("registrationSuccess.status") }}:</span
                >
                <span class="text-orange-400 font-semibold">
                  {{ $t("registrationSuccess.pendingApproval") }}
                </span>
              </p>
            </div>
          </div>

          <div class="mt-8">
            <button
              @click="goHome"
              class="cursor-pointer w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium transform transition-all duration-200 hover:shadow-lg"
            >
              {{ $t("registrationSuccess.returnHome") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { getDatabase, ref, set, get, push } from "firebase/database";
import { db } from "@/firebase";

export default {
  name: "RegistrationSuccess",
  data() {
    return {
      venueName: "",
      venueCategory: "",
      registrationDate: new Date(),
      paymentMethod: "",
      isCreditCardPayment: false,
      cashbackAmount: 0,
      venueData: null,
      requestSubmitted: false,
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
    async applyCashback() {
      // Check if cashback was already applied (for wallet payments)
      if (localStorage.getItem("cashbackApplied") === "true") {
        console.log("Cashback already applied from wallet payment, skipping");
        localStorage.removeItem("cashbackApplied"); // Clear the flag
        return;
      }

      // Check if cashback was already applied when clicking "Pay with Credit Card"
      if (
        this.isCreditCardPayment &&
        localStorage.getItem("pendingCashbackAmount") === null
      ) {
        console.log(
          "Cashback already applied when clicking Pay with Credit Card, skipping"
        );
        return;
      }

      if (!store.state.user?.id) {
        console.error("No user found, cannot apply cashback");
        return;
      }

      try {
        console.log("Attempting to apply cashback...");
        console.log("Payment method:", this.paymentMethod);
        console.log("Is credit card payment:", this.isCreditCardPayment);

        const userBalanceRef = ref(db, `users/${store.state.user.id}/balance`);

        // Get current balance
        const snapshot = await get(userBalanceRef);
        if (snapshot.exists()) {
          const currentBalance = snapshot.val() || 0;
          this.cashbackAmount = 200 * 0.05; // 5% of 200 EGP registration fee
          const newBalance = currentBalance + this.cashbackAmount;

          // Update balance with cashback
          await set(userBalanceRef, newBalance);
          console.log(
            `Successfully added ${this.cashbackAmount} EGP cashback. New balance: ${newBalance} EGP`
          );

          // Set the flag to prevent double application
          localStorage.setItem("cashbackApplied", "true");
        } else {
          console.error("No balance found for user");
        }
      } catch (error) {
        console.error("Error applying cashback:", error);
      }
    },
    async updateRequestStatus() {
      const requestID = localStorage.getItem("pendingRequestID");
      if (!requestID) {
        console.log("No pending request ID found");
        return;
      }

      try {
        console.log("Updating request status for ID:", requestID);

        // Get the request reference
        const requestRef = ref(db, `requests/${requestID}`);

        // Update the status to "pending" (from "pending_payment")
        await set(requestRef, {
          ...this.venueData,
          status: "pending",
          paymentCompleted: true,
          paymentCompletedAt: new Date().toISOString(),
        });

        console.log("Request status updated successfully");
        this.requestSubmitted = true;

        // Clear the pendingRequestID from localStorage
        localStorage.removeItem("pendingRequestID");
        localStorage.removeItem("pendingVenueRegistration");
      } catch (error) {
        console.error("Error updating request status:", error);
      }
    },
  },
  async mounted() {
    // Improved detection for Stripe redirects with detailed logging
    console.log("URL search params:", window.location.search);
    const urlParams = new URLSearchParams(window.location.search);

    // Check multiple possible Stripe success indicators
    const hasPaymentIntent = urlParams.has("payment_intent");
    const hasStripeSuccess = urlParams.get("stripe") === "success";
    const hasSuccessParam =
      urlParams.has("success") || urlParams.get("status") === "success";
    const hasRedirectStatus = urlParams.has("redirect_status");

    // If we have any indication of Stripe success, force credit card payment method
    const isStripeRedirect =
      hasPaymentIntent ||
      hasStripeSuccess ||
      hasSuccessParam ||
      hasRedirectStatus;

    if (isStripeRedirect) {
      console.log(
        "Detected return from Stripe, setting payment method to credit card"
      );
      this.paymentMethod = "Credit Card";
      this.isCreditCardPayment = true;

      // Clear all form data and registration data
      localStorage.removeItem("pendingCashbackAmount");
      localStorage.removeItem("cashbackApplied");
      localStorage.removeItem("pendingVenueRegistration");
      localStorage.removeItem("venueRegistrationForm");
      console.log("Cleared all registration form data");
    }

    // Try to get venue data from localStorage first
    const storedVenue = localStorage.getItem("pendingVenueRegistration");
    if (storedVenue) {
      try {
        this.venueData = JSON.parse(storedVenue);
        console.log("Retrieved venue data from localStorage:", this.venueData);
        this.venueName =
          this.venueData.venueName || this.venueData.name || "Not available";
        this.venueCategory = this.venueData.category || "Not available";

        // Only set payment method from stored data if not already set by Stripe redirect
        if (!isStripeRedirect) {
          this.paymentMethod =
            this.venueData.paymentMethod === "credit card"
              ? "Credit Card"
              : "Wallet";
          this.isCreditCardPayment =
            this.venueData.paymentMethod === "credit card";
        } else {
          // If this is a Stripe redirect, ensure payment method is set to credit card
          this.venueData.paymentMethod = "credit card";
        }
      } catch (error) {
        console.error("Error parsing venue data from localStorage:", error);
      }
    } else if (store.state.myFormData) {
      // Fallback to store if localStorage is empty
      this.venueData = store.state.myFormData;
      console.log("Retrieved venue data from store:", this.venueData);
      this.venueName =
        this.venueData.venueName || this.venueData.name || "Not available";
      this.venueCategory = this.venueData.category || "Not available";

      // Only set payment method from stored data if not already set by Stripe redirect
      if (!isStripeRedirect) {
        this.paymentMethod =
          this.venueData.paymentMethod === "credit card"
            ? "Credit Card"
            : "Wallet";
        this.isCreditCardPayment =
          this.venueData.paymentMethod === "credit card";
      } else {
        // If this is a Stripe redirect, ensure payment method is set to credit card
        this.venueData.paymentMethod = "credit card";
      }
    } else {
      console.warn("No venue data found in localStorage or store");
    }

    // If this is a Stripe redirect, update the request status
    if (isStripeRedirect && this.venueData) {
      console.log("Stripe payment successful, updating request status");
      await this.updateRequestStatus();
    }

    // Apply cashback based on payment method
    if (this.isCreditCardPayment) {
      // For credit card payments, check if cashback was already applied when clicking "Pay with Credit Card"
      if (localStorage.getItem("pendingCashbackAmount") === null) {
        console.log(
          "Cashback already applied when clicking Pay with Credit Card, skipping"
        );
      } else {
        console.log("Credit card payment detected, applying cashback");
        await this.applyCashback();
      }
    } else {
      console.log(
        "Wallet payment detected, checking if cashback already applied"
      );
      if (localStorage.getItem("cashbackApplied") === "true") {
        console.log("Cashback already applied from wallet payment");
        localStorage.removeItem("cashbackApplied"); // Clear the flag
      }
    }

    // Clean up stored data only if not needed anymore
    if (this.requestSubmitted) {
      localStorage.removeItem("pendingVenueRegistration");
      store.commit("setMyFormData", null);
    }
  },
};
</script>

<style scoped>
/* Animation keyframes */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes pulse-slower {
  0%,
  100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.15;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}
</style>
