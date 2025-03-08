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
          <span class="block mt-2">
            You have also received
            <span class="text-green-500 font-bold"
              >{{ (200 * 0.05).toFixed(2) }} EGP</span
            >
            cash back from our loyalty program!
          </span>
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
              <span class="font-medium">Payment Method: </span>
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
import { getDatabase, ref, set, get } from "firebase/database";
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
      // If cashback has already been applied, don't apply it again
      if (localStorage.getItem("cashbackApplied") === "true") {
        console.log("Cashback already applied, skipping");
        localStorage.removeItem("cashbackApplied"); // Clear the flag
        return;
      }

      if (!store.state.user?.id) {
        console.error("No user found, cannot apply cashback");
        return;
      }

      try {
        console.log("Attempting to apply cashback...");
        console.log("Payment method:", this.paymentMethod);

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
  },
  async mounted() {
    // Get URL parameters
    console.log("URL search params:", window.location.search);
    const urlParams = new URLSearchParams(window.location.search);

    // Check for Stripe success indicators
    const hasPaymentIntent = urlParams.has("payment_intent");
    const hasStripeSuccess = urlParams.get("stripe") === "success";
    const hasSuccessParam =
      urlParams.has("success") || urlParams.get("status") === "success";
    const hasRedirectStatus = urlParams.has("redirect_status");

    // If we have any indication of Stripe success, set as credit card payment
    const isStripeRedirect =
      hasPaymentIntent ||
      hasStripeSuccess ||
      hasSuccessParam ||
      hasRedirectStatus;

    // Try to get venue data from localStorage first
    const storedVenue = localStorage.getItem("pendingVenueRegistration");
    let venueData;

    if (storedVenue) {
      venueData = JSON.parse(storedVenue);
      this.venueName = venueData.name || venueData.venueName || "Not available";
      this.venueCategory = venueData.category || "Not available";
    } else if (store.state.myFormData) {
      // Fallback to store if localStorage is empty
      venueData = store.state.myFormData;
      this.venueName = venueData.name || venueData.venueName || "Not available";
      this.venueCategory = venueData.category || "Not available";
    }

    if (isStripeRedirect) {
      console.log(
        "Detected return from Stripe, processing credit card payment"
      );
      this.paymentMethod = "Credit Card";
      this.isCreditCardPayment = true;

      try {
        if (!store.state.user?.id) {
          console.error("No user found for Stripe payment");
          return;
        }

        const db = getDatabase();
        const id = "id" + Math.random().toString(16).slice(2);

        // Prepare venue data for saving
        const venueToSave = {
          ...venueData,
          id,
          ownerId: store.state.user.id,
          createdAt: new Date().toISOString(),
          status: "pending",
          paymentStatus: "paid",
          paymentMethod: "credit card",
          paymentDate: new Date().toISOString(),
        };

        // Save venue to requests collection
        await set(ref(db, `requests/${id}`), venueToSave);

        // Save reference to user's pending venues
        const userVenueRef = ref(
          db,
          `users/${store.state.user.id}/pendingVenues/${id}`
        );
        await set(userVenueRef, {
          venueId: id,
          status: "pending",
          registrationDate: new Date().toISOString(),
          paymentStatus: "paid",
          paymentDate: new Date().toISOString(),
        });

        // Cashback should have already been applied when clicking "Pay with Credit Card"
        // We don't need to apply it again here
        console.log(
          "Credit card payment successful, cashback should be already applied"
        );
      } catch (error) {
        console.error("Error processing Stripe success:", error);
      }
    } else {
      // For non-Stripe payments (wallet), just set the payment method
      this.paymentMethod =
        venueData?.paymentMethod === "credit card" ? "Credit Card" : "Wallet";
      this.isCreditCardPayment = venueData?.paymentMethod === "credit card";

      // Check if cashback was already applied
      if (localStorage.getItem("cashbackApplied") === "true") {
        console.log("Cashback already applied");
        localStorage.removeItem("cashbackApplied"); // Clear the flag
      }
    }

    // Clean up stored data
    localStorage.removeItem("pendingVenueRegistration");
  },
};
</script>
