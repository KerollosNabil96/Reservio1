<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-gray-800">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl dark:bg-gray-900 text-gray-900">
      <div class="flex items-center justify-center mb-6">
        <div class="w-8 h-8 bg-green-500 flex items-center justify-center rounded-full">
          ✔
        </div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div class="w-8 h-8 bg-green-500 flex items-center justify-center rounded-full">
          ✔
        </div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div class="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
          3
        </div>
      </div>
      <h2 class="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
        Payment
      </h2>
      <p class="text-gray-500 text-center mb-6 dark:text-gray-200">
        Kindly review your balance
      </p>

      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="w-full md:w-1/2">
          <h3 class="font-semibold dark:text-gray-200">Transfer Reservio:</h3>
          <p class="text-gray-700 dark:text-gray-400">{{ venue.name }}</p>
          <p class="text-gray-500 text-sm dark:text-gray-400">
            {{ venue.address.city }}, {{ venue.address.governorate }}
          </p>
          <p class="mt-2 font-semibold dark:text-gray-100">
            Time Slot: <span class="font-normal">{{ venue.timeSlots[selectedTimeSlotId].from }} - {{
              venue.timeSlots[selectedTimeSlotId].to }}</span>
          </p>
          <img :src="venue.pictures[0]" alt="Stadium" class="w-full h-32 object-cover rounded-lg mt-2" />
        </div>

        <div class="w-full md:w-1/2 space-y-4">
          <p class="text-lg font-semibold dark:text-gray-100">
            Your Balance:
            <span class="text-blue-600">{{ userBalance }} EGP</span>
          </p>
          <p class="text-lg font-semibold dark:text-gray-100">
            Booking Price:
            <span class="text-red-500">{{ venue.price }} EGP</span>
          </p>
          <p class="text-lg font-semibold dark:text-gray-100">
            Balance After Booking:
            <span :class="balanceAfterBooking < 0 ? 'text-red-500' : 'text-green-500'
              ">
              {{ balanceAfterBooking }} EGP
            </span>
          </p>
          <p class="text-lg font-semibold dark:text-gray-100">
            Available Slots:
            <span class="text-green-600">{{ availableSlots }}</span>
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
        <button @click="processPayment" :disabled="balanceAfterBooking < 0 || loading || availableSlots <= 0"
          class="cursor-pointer w-full py-2 rounded-lg font-bold" :class="balanceAfterBooking < 0 || availableSlots <= 0
            ? 'bg-gray-300 hover:bg-gray-200 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500'
            ">
          {{ loading ? "Processing..." : "Pay Now" }}
        </button>
        <button class="cursor-pointer w-full hover:bg-gray-200 bg-gray-300 text-gray-600 py-2 rounded-lg"
          @click="cancelBooking">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDatabase,
  ref,
  get,
  update,
  runTransaction,
} from "firebase/database";
import store from "@/store/store";

export default {
  name: "Payment",
  data() {
    return {
      userBalance: 0,
      availableSlots: 0,
      loading: false,
      paymentSuccess: false,
      paymentError: "",
    };
  },
  computed: {
    venue() {
      return this.$store.getters.getSelectedVenue;
    },
    selectedTimeSlotId() {
      return this.$route.query.timeSlotId || "0"; // Get the time slot ID from the route query, fallback to "0"
    },
    balanceAfterBooking() {
      return this.userBalance - this.venue.price;
    },
  },
  methods: {
    cancelBooking() {
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
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    },

    async fetchAvailableSlots() {
      const venueId = this.venue.id;
      const db = getDatabase();
      const timeSlotRef = ref(db, `venues/${venueId}/timeSlots/${this.selectedTimeSlotId}/available`);
      const snapshot = await get(timeSlotRef);

      if (snapshot.exists()) {
        this.availableSlots = snapshot.val();
      } else {
        console.log("No available slots found.");
      }
    },

    async processPayment() {
      if (this.balanceAfterBooking < 0) {
        this.paymentError = "Insufficient balance.";
        return;
      }

      if (this.availableSlots <= 0) {
        this.paymentError = "No available slots left.";
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
        const userRef = ref(db, `users/${user.id}`);

        await update(userRef, { balance: this.balanceAfterBooking });

        const venueId = this.venue.id;
        const timeSlotRef = ref(db, `venues/${venueId}/timeSlots/${this.selectedTimeSlotId}/available`);

        await runTransaction(timeSlotRef, (currentAvailableSlots) => {
          console.log(
            "Transaction executed. Current slots:",
            currentAvailableSlots
          );

          return currentAvailableSlots;
        });

        const updatedSnapshot = await get(timeSlotRef);
        if (updatedSnapshot.exists()) {
          this.availableSlots = updatedSnapshot.val();
          console.log("Updated slots:", this.availableSlots);
        }

        this.paymentSuccess = true;
        this.userBalance = this.balanceAfterBooking;

        setTimeout(() => {
          this.loading = false;
          this.$router.push("/booking-success");
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
    this.fetchAvailableSlots();
  },
};
</script>
