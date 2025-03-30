<template>
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload your Educational Center
      License</label>
    <CloudinaryUploader v-model="educationalLicense" :cloud-name="cloudName" :upload-preset="uploadPreset"
      folder="educational_licenses" upload-text="Upload your educational center license"
      @upload-success="handleLicenseUpload" />
  </div>

  <!-- Date Picker -->
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Pick a Date
    </label>
    <input type="date" v-model="selectedDate" @change="validateDate"
      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" />
    <!-- Error message for invalid date -->
    <div v-if="dateError" class="text-red-500 text-sm mt-2">
      {{ dateError }}
    </div>
  </div>

  <!-- Time Slot Selection -->
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select time slot</label>
    <div class="flex gap-3 mt-2">
      <div class="w-1/3">
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
        <input type="time" v-model="fromTime"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" />
      </div>
      <div class="w-1/3">
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
        <input type="time" v-model="toTime"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm" />
      </div>
      <div class="w-1/3">
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Capacity</label>
        <input type="number" v-model.number="capacity"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
          placeholder="Capacity" min="1" />
      </div>
    </div>
    <button @click="addTimeSlot"
      class="cursor-pointer mt-4 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium transform transition-all duration-200 hover:shadow-lg">
      Add Time Slot
    </button>
  </div>

  <!-- Time Slots List -->
  <div v-if="timeSlots.length > 0" class="mb-6">
    <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
      Added Time Slots
    </h3>
    <div class="space-y-3">
      <div v-for="(slot, index) in timeSlots" :key="index"
        class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 backdrop-blur-sm">
        <div class="text-gray-700 dark:text-gray-300">
          <span class="font-medium">{{ slot.from }} - {{ slot.to }}</span>
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ slot.capacity }} spots)</span>
        </div>
        <button @click="removeTimeSlot(index)"
          class="cursor-pointer text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Error Message -->
  <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
    {{ errorMessage }}
  </div>

  <!-- Submit Button -->
  <div class="mt-8">
    <button @click="openPaymentPopup" :disabled="!canProceed"
      class="cursor-pointer w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium transform transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
      Proceed to Payment
    </button>
  </div>

  <!-- Payment Popup with dark overlay -->
  <div v-if="showPaymentPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Choose Payment Method
        </h3>
        <button @click="closePaymentPopup"
          class="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-6">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Registration fee: <span class="font-bold">200 EGP</span>
        </p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Select your preferred payment method:
        </p>
      </div>

      <div class="space-y-4">
        <button @click="payWithWallet" :disabled="isLoading || !hasEnoughBalance"
          class="cursor-pointer w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white font-medium transform transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          <span v-if="isLoading && paymentMethod === 'wallet'" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </span>
          Pay with Wallet
          <span class="text-sm ms-1">
            (Current Balance: {{ userBalance }} EGP)</span>
        </button>

        <button @click="payWithCreditCard" :disabled="isLoading"
          class="cursor-pointer w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium transform transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          <span v-if="isLoading && paymentMethod === 'credit card'" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </span>
          Pay with Credit Card
        </button>
      </div>

      <div v-if="!hasEnoughBalance"
        class="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
        <p class="text-sm">
          Insufficient wallet balance. Please add funds or use a credit card.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { getDatabase, ref, set, push } from "firebase/database";
import { db } from "@/firebase";
import CloudinaryUploader from "@/components/common/CloudinaryUploader.vue";

export default {
  components: {
    CloudinaryUploader,
  },
  props: ["requiredLicenses"],
  data() {
    return {
      selectedDate: "",
      fromTime: "",
      toTime: "",
      capacity: 5,
      timeSlots: [],
      errorMessage: "",
      educationalLicense: "",
      showPaymentPopup: false,
      isLoading: false,
      paymentMethod: null,
      userBalance: 0,
      hasEnoughBalance: true,
      selectedDate: "",
      dateError: "",
      cloudName:
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name",
      uploadPreset:
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset",
    };
  },
  computed: {
    canProceed() {
      const selectedDate = new Date(this.selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isDateValid = selectedDate >= today;
      return (
        this.selectedDate &&
        isDateValid &&
        this.timeSlots.length > 0 &&
        this.educationalLicense
      );
    },
  },
  methods: {
    validateDate() {
      const selectedDate = new Date(this.selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates

      if (selectedDate < today) {
        this.dateError = "You cannot select a date before today.";
      } else {
        this.dateError = ""; // Clear error if date is valid
      }
    },
    addTimeSlot() {
      // Reset error message
      this.errorMessage = "";

      if (!this.fromTime || !this.toTime) {
        this.errorMessage = "Please select both from and to times.";
        return;
      }

      if (this.capacity <= 0) {
        this.errorMessage = "Capacity must be greater than 0.";
        return;
      }

      // Convert times to Date objects for comparison
      const fromTimeDate = new Date(`2000-01-01T${this.fromTime}`);
      const toTimeDate = new Date(`2000-01-01T${this.toTime}`);

      // Check if "to" time is before "from" time
      if (toTimeDate <= fromTimeDate) {
        this.errorMessage = "End time must be after start time.";
        return;
      }

      // Check for overlapping time slots
      for (const slot of this.timeSlots) {
        const slotFromTime = new Date(`2000-01-01T${slot.from}`);
        const slotToTime = new Date(`2000-01-01T${slot.to}`);

        // Check if new slot overlaps with existing slot
        if (
          (fromTimeDate >= slotFromTime && fromTimeDate < slotToTime) || // New start time falls within existing slot
          (toTimeDate > slotFromTime && toTimeDate <= slotToTime) || // New end time falls within existing slot
          (fromTimeDate <= slotFromTime && toTimeDate >= slotToTime) // New slot completely contains existing slot
        ) {
          this.errorMessage = "Time slot overlaps with an existing slot.";
          return;
        }
      }

      // If all validations pass, add the time slot
      this.timeSlots.push({
        id: this.timeSlots.length,
        from: this.fromTime,
        to: this.toTime,
        capacity: this.capacity,
        available: this.capacity,
      });

      // Clear inputs after adding
      this.fromTime = "";
      this.toTime = "";
      this.capacity = 5;
    },
    removeTimeSlot(index) {
      this.timeSlots.splice(index, 1);
    },
    openPaymentPopup() {
      if (!this.canProceed) {
        this.errorMessage =
          "Please fill in all required fields and add at least one time slot.";
        return;
      }

      // Check if educational license is provided
      if (!this.educationalLicense) {
        this.errorMessage = "Please enter your educational center license.";
        return;
      }

      // Refresh user balance before showing the payment popup
      this.fetchUserBalance();
      this.showPaymentPopup = true;
    },
    closePaymentPopup() {
      this.showPaymentPopup = false;
    },
    closePopUp() {
      this.showPaymentPopup = false;
    },
    async payWithCreditCard() {
      try {
        this.isLoading = true;
        this.errorMessage = "";
        this.paymentMethod = "credit card";

        // Get form data from first registration step
        const formData = { ...store.state.myFormData };

        // Create venue data object combining both forms
        const requestID = Math.random().toString(36).substring(2, 15);
        const venueData = {
          ...formData,
          id: requestID,
          ownerId: store.state.user.id,
          createdAt: new Date().toISOString(),
          paymentStatus: "paid",
          selectedDate: this.selectedDate,
          educationalLicense: this.educationalLicense || "", // Ensure this is never undefined
          timeSlots: this.timeSlots,
          paymentMethod: "credit card",
          submittedAt: new Date().toISOString(),
          status: "pending_payment",
        };

        // Save to store and localStorage for later use
        store.state.myFormData = venueData;
        localStorage.setItem(
          "pendingVenueRegistration",
          JSON.stringify(venueData)
        );

        // Apply cashback immediately (5% of 200 EGP registration fee)
        const cashbackAmount = 200 * 0.05; // 10 EGP
        await this.applyCashback(cashbackAmount);

        // Save venue to requests collection first
        localStorage.setItem("pendingRequestID", requestID);

        // Save the venue data to Firebase
        const requestsRef = ref(db, `requests/${requestID}`);
        await set(requestsRef, venueData);
        console.log("Venue request saved with ID:", requestID);

        // Create Stripe checkout session
        const response = await fetch(
          "http://localhost:3000/create-checkout-session-register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              venue: venueData,
              requestID: requestID, // Pass the request ID to Stripe
            }),
          }
        );

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        // If there was an error, remove the request from Firebase and revert cashback
        this.removeFailedRequest();
        await this.revertCashback();
        this.errorMessage =
          error.message || "Failed to process payment. Please try again.";

        // Close the payment popup to show the error in the main component
        this.closePaymentPopup();
      } finally {
        this.isLoading = false;
      }
    },
    async applyCashback(amount) {
      if (!store.state.user?.id) {
        console.error("No user found, cannot apply cashback");
        return;
      }

      try {
        console.log("Applying cashback of", amount, "EGP");
        const userBalanceRef = ref(db, `users/${store.state.user.id}/balance`);

        // Get current balance
        const currentBalance = this.userBalance;
        const newBalance = currentBalance + amount;

        // Update balance with cashback
        await set(userBalanceRef, newBalance);
        console.log(
          `Successfully added ${amount} EGP cashback. New balance: ${newBalance} EGP`
        );

        // Store the cashback amount for potential reversion
        localStorage.setItem("pendingCashbackAmount", amount.toString());

        // Update local state
        this.userBalance = newBalance;
      } catch (error) {
        console.error("Error applying cashback:", error);
      }
    },
    async revertCashback() {
      if (!store.state.user?.id) {
        console.error("No user found, cannot revert cashback");
        return;
      }

      const cashbackAmount = parseFloat(
        localStorage.getItem("pendingCashbackAmount") || "0"
      );
      if (cashbackAmount <= 0) {
        console.log("No cashback to revert");
        return;
      }

      try {
        console.log("Reverting cashback of", cashbackAmount, "EGP");
        const userBalanceRef = ref(db, `users/${store.state.user.id}/balance`);

        // Get current balance
        const currentBalance = this.userBalance;
        const newBalance = currentBalance - cashbackAmount;

        // Update balance by removing the cashback
        await set(userBalanceRef, newBalance);
        console.log(
          `Successfully reverted ${cashbackAmount} EGP cashback. New balance: ${newBalance} EGP`
        );

        // Clear the stored cashback amount
        localStorage.removeItem("pendingCashbackAmount");

        // Update local state
        this.userBalance = newBalance;
      } catch (error) {
        console.error("Error reverting cashback:", error);
      }
    },
    async removeFailedRequest() {
      try {
        const requestID = localStorage.getItem("pendingRequestID");
        if (requestID) {
          const requestRef = ref(db, `requests/${requestID}`);
          await set(requestRef, null);
          console.log("Removed failed request:", requestID);
          localStorage.removeItem("pendingRequestID");
        }
      } catch (error) {
        console.error("Error removing failed request:", error);
      }
    },
    payWithWallet() {
      // Get form data from first registration step
      const formData = store.state.myFormData;

      // Create venue data object combining both forms
      const venueData = {
        ...formData,
        selectedDate: this.selectedDate,
        educationalLicense: this.educationalLicense,
        timeSlots: this.timeSlots,
        paymentMethod: "wallet",
      };

      // Save to store and localStorage for later use
      store.state.myFormData = venueData;
      localStorage.setItem(
        "pendingVenueRegistration",
        JSON.stringify(venueData)
      );

      // Redirect to payment page
      this.$router.push("/venueRegistrationPayment");
    },
    uploadLicense(event) {
      this.requiredLicenses = event.target.files;
    },
    fetchUserBalance() {
      if (store.state.user && store.state.user.balance !== undefined) {
        this.userBalance = store.state.user.balance;
        this.hasEnoughBalance = this.userBalance >= 200; // 200 EGP is the registration fee
      }
    },
  },
  mounted() {
    // Fetch user balance when component is mounted
    this.fetchUserBalance();
  },
  watch: {
    selectedDate(newDate) {
      this.validateDate();
    },
    // Watch for changes in the user object
    "store.state.user": {
      handler(newUser) {
        if (newUser && newUser.balance !== undefined) {
          this.userBalance = newUser.balance;
          this.hasEnoughBalance = this.userBalance >= 200; // 200 EGP is the registration fee
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
