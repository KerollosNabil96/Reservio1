<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-gray-800"
  >
    <div
      class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl dark:bg-gray-900"
    >
      <div class="flex items-center justify-center mb-6">
        <div
          class="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full"
        >
          ✔
        </div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div
          class="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full"
        >
          ✔
        </div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div
          class="w-8 h-8 bg-gray-300 text-white flex items-center justify-center rounded-full"
        >
          3
        </div>
      </div>
      <h2
        class="text-xl font-bold text-center text-gray-800 dark:text-gray-100"
      >
        Payment
      </h2>
      <p class="text-gray-500 text-center mb-6 dark:text-gray-200">
        Kindly follow the instructions below
      </p>

      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="w-full md:w-1/2">
          <h3 class="font-semibold dark:text-gray-200">Transfer Reservio:</h3>
          <p class="text-gray-700 dark:text-gray-400">{{ venue.name }}</p>
          <p class="text-gray-500 text-sm dark:text-gray-400">
            {{ venue.address.city }}, {{ venue.address.governorate }}
          </p>
          <p class="mt-2 font-semibold dark:text-gray-100">
            Time Slot: <span class="font-normal">7:00 PM - 8:00 PM</span>
          </p>
          <img
            :src="venue.pictures[0]"
            alt="Stadium"
            class="w-full h-32 object-cover rounded-lg mt-2"
          />
          <p class="mt-4 font-bold dark:text-gray-100">
            Total: <span class="text-blue-600">{{ venue.price }} EGP</span>
          </p>
        </div>

        <div class="w-full md:w-1/2 space-y-4">
          <input
            type="text"
            placeholder="Payment card number"
            class="w-full p-2 border rounded-lg dark:text-gray-200"
            v-model="cardNumber"
            @input="validateInput"
          />
          <input
            type="text"
            placeholder="Expiration date (MM/YY)"
            class="w-full p-2 border rounded-lg dark:text-gray-200"
            v-model="cardExpiry"
            @input="validateInput"
          />
          <input
            type="text"
            placeholder="CVV"
            class="w-full p-2 border rounded-lg dark:text-gray-200"
            v-model="cardCvc"
            @input="validateInput"
          />
        </div>
      </div>

      <p v-if="paymentError" class="text-red-500 text-center mt-2">
        {{ paymentError }}
      </p>
      <p v-if="paymentSuccess" class="text-green-500 text-center mt-2">
        Payment Successful!
      </p>

      <div class="mt-6 flex flex-col space-y-2">
        <button
          @click="processPayment"
          :disabled="!isFormValid || loading"
          class="w-full py-2 rounded-lg font-bold"
          :class="
            isFormValid
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          "
        >
          {{ loading ? "Processing..." : "Pay Now" }}
        </button>
        <button
          class="w-full bg-gray-300 text-gray-600 py-2 rounded-lg"
          @click="cancelBooking"
        >
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Payment",
  data() {
    return {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      loading: false,
      paymentSuccess: false,
      paymentError: "",
    };
  },
  computed: {
    myFormData() {
      return this.$store.state.myFormData;
    },
    venue() {
      return this.$store.getters.getSelectedVenue;
    },
    isFormValid() {
      return (
        /^\d{16}$/.test(this.cardNumber) &&
        /^(\d{2})\/(\d{2})$/.test(this.cardExpiry) &&
        /^\d{3,4}$/.test(this.cardCvc) &&
        this.isExpiryDateValid()
      );
    },
  },
  methods: {
    cancelBooking() {
      this.$router.back();
    },
    validateInput() {
      this.paymentError = "";
    },
    isExpiryDateValid() {
      let currentYear = new Date().getFullYear() % 100;
      let currentMonth = new Date().getMonth() + 1;

      let expiryMatch = this.cardExpiry.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) return false;

      let month = parseInt(expiryMatch[1], 10);
      let year = parseInt(expiryMatch[2], 10);

      return !(
        month < 1 ||
        month > 12 ||
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      );
    },
    async processPayment() {
      this.loading = true;
      this.paymentError = "";
      this.paymentSuccess = false;

      if (!this.isFormValid) {
        this.paymentError = "Please enter valid payment details.";
        this.loading = false;
        return;
      }

      setTimeout(() => {
        this.paymentSuccess = true;
        this.loading = false;
        this.$router.push("/PaymentSuccess");
      }, 2000);
    },
  },
};
</script>

<style scoped></style>
