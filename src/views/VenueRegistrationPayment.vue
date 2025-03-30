<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-gray-800">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl dark:bg-gray-900 text-gray-900">
      <h2 class="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        Venue Registration Payment
      </h2>
      <p class="text-gray-500 text-center mb-6 dark:text-gray-200">
        Kindly review your balance
      </p>

      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="w-full md:w-1/2">
          <h3 class="font-semibold dark:text-gray-200">Venue Details:</h3>
          <p class="text-gray-700 dark:text-gray-400">{{ venue.name }}</p>
          <p class="text-gray-500 text-sm dark:text-gray-400">
            {{ venue.address.city }}, {{ venue.address.governorate }}
          </p>
          <p class="text-gray-500 text-sm dark:text-gray-400">
            Category: {{ venue.category }}
          </p>
          <p class="mt-2 font-semibold dark:text-gray-100">
            Registration Fee: <span class="font-normal">200 EGP</span>
          </p>
        </div>

        <div class="w-full md:w-1/2 space-y-4">
          <p class="text-lg font-semibold dark:text-gray-100">
            Your Balance:
            <span class="text-blue-600">{{ userBalance }} EGP</span>
          </p>
          <p class="text-lg font-semibold dark:text-gray-100">
            Registration Fee:
            <span class="text-red-500">200 EGP</span>
          </p>
          <p class="text-lg font-semibold dark:text-gray-100">
            Balance After Registration:
            <span :class="balanceAfterRegistration < 0 ? 'text-red-500' : 'text-green-500'
              ">
              {{ balanceAfterRegistration }} EGP
            </span>
          </p>
        </div>
      </div>

      <p v-if="paymentError" class="text-red-500 text-center mt-2">
        {{ paymentError }}
      </p>
      <p v-if="paymentSuccess" class="text-green-500 text-center mt-2">
        Payment Successful!
      </p>

      <div class="mt-6 flex flex-col space-y-2">
        <button @click="processPayment" :disabled="balanceAfterRegistration < 0 || loading"
          class="cursor-pointer w-full py-2 rounded-lg font-bold" :class="balanceAfterRegistration < 0
            ? 'bg-gray-300 hover:bg-gray-200 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
            ">
          {{ loading ? "Processing..." : "Pay Now" }}
        </button>
        <button class="cursor-pointer w-full hover:bg-gray-200 bg-gray-300 text-gray-600 py-2 rounded-lg"
          @click="cancelRegistration">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get, set, update } from "firebase/database";
import store from "@/store/store";
import BookingInfoPayment from "./BookingInfoPayment.vue";

export default {
  name: "VenueRegistrationPayment",
  data() {
    return {
      userBalance: 0,
      registrationFee: 200, // Fixed registration fee
      loading: false,
      paymentSuccess: false,
      paymentError: "",
    };
  },
  computed: {
    venue() {
      return store.state.myFormData;
    },
    balanceAfterRegistration() {
      return this.userBalance - this.registrationFee;
    },
  },
  methods: {
    addExistFieldToTimeSlots(timeSlots) {
      const updatedTimeSlots = {};
      for (const timeSlotId in timeSlots) {
        updatedTimeSlots[timeSlotId] = {
          ...timeSlots[timeSlotId],
          exist: true, // Add the `exist` field
        };
      }
      return updatedTimeSlots;
    },
    cancelRegistration() {
      this.$router.back();
    },

    async fetchBalance() {
      const user = store.state.user;
      if (!user) {
        console.error("No user found!");
        return;
      }

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.id}/balance`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          this.userBalance = snapshot.val();
        } else {
          console.log("No balance found for this user.");
          this.userBalance = 0;
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    },

    async processPayment() {
      if (this.balanceAfterRegistration < 0) {
        this.paymentError = "Insufficient balance.";
        return;
      }

      if (this.loading) {
        return;
      }

      this.loading = true;
      this.paymentError = "";
      this.paymentSuccess = false;

      try {
        const user = store.state.user;
        if (!user) {
          console.error("No user found!");
          this.loading = false;
          return;
        }

        const db = getDatabase();

        // Update user balance
        const userRef = ref(db, `users/${user.id}`);
        const userBalanceRef = ref(db, `users/${user.id}/balance`);
        await update(userRef, { balance: this.balanceAfterRegistration });

        // Get current balance after deduction and add cashback (5% of 200 EGP)
        const snapshot = await get(userBalanceRef);
        if (snapshot.exists()) {
          const currentBalance = snapshot.val();
          const cashbackAmount = 200 * 0.05;
          await set(userBalanceRef, currentBalance + cashbackAmount);
          console.log(`Added ${cashbackAmount} EGP cashback to user balance`);
        }

        const id = "id" + Math.random().toString(16).slice(2);

        // Prepare venue data for saving
        const venueData = {
          ...this.venue,
          id,
          ownerId: user.id,
          createdAt: new Date().toISOString(),
          status: "pending",
          paymentStatus: "paid",
          paymentMethod: "wallet",
          paymentDate: new Date().toISOString(),
          timeSlots: this.addExistFieldToTimeSlots(this.venue.timeSlots), // Add `exist` field to time slots
        };

        // Save venue to requests collection
        await set(ref(db, `requests/${id}`), venueData);

        // Also save reference to user's pending venues
        if (user?.id) {
          const userVenueRef = ref(db, `users/${user.id}/pendingVenues/${id}`);
          await set(userVenueRef, {
            venueId: venueData.id,
            status: "pending",
            registrationDate: new Date().toISOString(),
            paymentStatus: "paid",
            paymentDate: new Date().toISOString(),
          });
        }

        // Set a flag to indicate cashback was already applied
        localStorage.setItem("cashbackApplied", "true");

        this.paymentSuccess = true;
        this.userBalance = this.balanceAfterRegistration;

        // Remove all registration-related data from localStorage
        localStorage.removeItem("pendingVenueRegistration");
        localStorage.removeItem("venueRegistrationForm");

        setTimeout(() => {
          this.loading = false;
          this.$router.push("/registration-success");
        }, 2000);
      } catch (error) {
        console.error("Error processing payment:", error);
        this.paymentError = "An error occurred while processing payment.";
        this.loading = false;
      }
    },
  },

  mounted() {
    this.fetchBalance();

    // Check if we have pending registration data
    if (!this.venue || Object.keys(this.venue).length === 0) {
      const pendingRegistration = localStorage.getItem(
        "pendingVenueRegistration"
      );
      if (pendingRegistration) {
        store.state.myFormData = JSON.parse(pendingRegistration);
      } else {
        this.$router.push("/");
      }
    }
  },
};
</script>
