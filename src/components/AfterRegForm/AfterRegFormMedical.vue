<template>
  <div class="mb-4">
    <label class="block font-medium dark:text-white"
      >Add your Medical License</label
    >
    <input
      type="text"
      v-model="medicalLicense"
      class="mt-2 border p-2 w-full rounded-md dark:text-white"
    />
  </div>

  <div class="mb-4">
    <label class="block font-medium dark:text-white"
      >Add your Clinic License</label
    >
    <input
      type="text"
      v-model="clinicLicense"
      class="mt-2 border p-2 w-full rounded-md dark:text-white"
    />
  </div>

  <!-- Date Picker -->
  <div class="mb-4">
    <label class="block font-medium dark:text-white">Pick a Date</label>
    <input
      type="date"
      v-model="selectedDate"
      class="mt-2 border p-2 w-full rounded-md dark:text-white"
    />
  </div>

  <!-- Time Slot Selection -->
  <div class="mb-4">
    <label class="block font-medium dark:text-white">Select time slot</label>
    <div class="flex gap-2 mt-2">
      <input
        type="time"
        v-model="fromTime"
        class="border p-2 w-1/3 rounded-md dark:text-white"
      />
      <input
        type="time"
        v-model="toTime"
        class="border p-2 w-1/3 rounded-md dark:text-white"
      />
      <input
        type="number"
        v-model.number="capacity"
        class="border p-2 w-1/3 rounded-md dark:text-white"
        placeholder="Capacity"
        min="1"
      />
    </div>
    <button
      @click="addTimeSlot"
      class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
    >
      Add Time Slot
    </button>
  </div>

  <!-- Time Slots Table -->
  <div class="mt-4 border rounded-md p-4">
    <table class="w-full text-left">
      <thead>
        <tr class="border-b">
          <th class="py-2 dark:text-white">From</th>
          <th class="py-2 dark:text-white">To</th>
          <th class="py-2 dark:text-white">Capacity</th>
          <th class="py-2 dark:text-white">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(slot, index) in timeSlots" :key="index" class="border-b">
          <td class="py-2 dark:text-white">{{ slot.from }}</td>
          <td class="py-2 dark:text-white">{{ slot.to }}</td>
          <td class="py-2 dark:text-white">{{ slot.capacity }}</td>
          <td class="py-2 dark:text-white">
            <button @click="removeTimeSlot(index)" class="text-red-500">
              ✖
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Proceed Button -->
  <button
    @click="openPaymentPopup"
    :disabled="!canProceed"
    class="mt-6 w-full bg-green-600 text-white py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    Proceed to Payment
  </button>
  <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>

  <!-- Payment Popup with dark overlay -->
  <div
    v-if="showPaymentPopup"
    class="fixed inset-0 flex items-center justify-center"
  >
    <div
      @click.self="closePopUp"
      class="absolute inset-0 bg-black opacity-70 z-20"
    ></div>
    <div class="bg-white p-6 rounded-lg w-96 relative z-30">
      <button
        @click="closePaymentPopup"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-900 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
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
      </button>

      <h3 class="text-lg font-bold text-center mb-4">Choose Payment Method</h3>
      <div class="flex flex-col gap-4">
        <button
          @click="payWithCreditCard"
          class="bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          <div
            v-if="isLoading"
            class="flex items-center justify-center space-x-2"
          >
            <div
              class="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
            ></div>
            <span>Processing...</span>
          </div>
          <div v-else>Pay with Credit Card</div>
        </button>
        <button
          @click="payWithWallet"
          class="bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Pay with Your Wallet
        </button>
        <button
          @click="closePaymentPopup"
          class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";

export default {
  props: ["requiredLicenses"],
  data() {
    return {
      selectedDate: "",
      fromTime: "",
      toTime: "",
      capacity: 5,
      timeSlots: [],
      errorMessage: "",
      medicalLicense: "",
      clinicLicense: "",
      showPaymentPopup: false,
      isLoading: false,
    };
  },
  computed: {
    canProceed() {
      return (
        this.selectedDate &&
        this.timeSlots.length > 0 &&
        this.medicalLicense &&
        this.clinicLicense
      );
    },
  },
  methods: {
    addTimeSlot() {
      if (this.fromTime && this.toTime && this.capacity > 0) {
        this.timeSlots.push({
          id: this.timeSlots.length,
          from: this.fromTime,
          to: this.toTime,
          capacity: this.capacity,
          available: this.capacity,
        });
        this.fromTime = "";
        this.toTime = "";
        this.capacity = 5;
      }
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

        const formData = store.state.myFormData;

        // Create venue data object combining both forms
        const venueData = {
          ...formData,
          selectedDate: this.selectedDate,
          medicalLicense: this.medicalLicense,
          clinicLicense: this.clinicLicense,
          timeSlots: this.timeSlots,
          paymentMethod: "credit card",
        };

        // Save to store and localStorage for later use
        store.state.myFormData = venueData;
        localStorage.setItem(
          "pendingVenueRegistration",
          JSON.stringify(venueData)
        );

        // Create Stripe checkout session
        const response = await fetch(
          "http://localhost:3000/create-checkout-session-register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              venue: venueData,
            }),
          }
        );

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        this.errorMessage =
          error.message || "Failed to process payment. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    payWithWallet() {
      const formData = store.state.myFormData;

      // Create venue data object combining both forms
      const venueData = {
        ...formData,
        selectedDate: this.selectedDate,
        medicalLicense: this.medicalLicense,
        clinicLicense: this.clinicLicense,
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
  },
};
</script>

<style lang="scss" scoped></style>
