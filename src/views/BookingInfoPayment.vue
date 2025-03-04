<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-gray-800">
      <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl dark:bg-gray-900">
        <div class="flex justify-center space-x-2 mb-4">
          <span class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center  text-white">✔</span>
          <span class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✔</span>
          <span class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">3</span>
        </div>
        <h2 class="text-xl font-bold text-center text-gray-800 dark:text-gray-100">Payment</h2>
        <p class="text-gray-500 text-center mb-6 dark:text-gray-200">Kindly follow the instructions below</p>
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="w-full md:w-1/2">
            <h3 class="font-semibold dark:text-gray-200">Transfer Reservio:</h3>
            <p class="text-gray-700 dark:text-gray-400">{{ venue.name }}</p>
            <p class="text-gray-500 text-sm dark:text-gray-400">{{venue.address.city}},{{ venue.address.governorate }}</p>
            <p class="mt-2 font-semibold dark:text-gray-100">Time Slot: <span class="font-normal">7:00 PM - 8:00 PM</span></p>
            <img :src="venue.pictures[0]" alt="Stadium" class="w-full h-32 object-cover rounded-lg mt-2" />
            <p class="mt-4 font-bold dark:text-gray-100">Total: <span class="text-blue-600">{{venue.price}} EGP</span></p>
          </div>
          <div class="w-full md:w-1/2 space-y-4">
            <input type="text" placeholder="Payment card number" class="w-full p-2 border rounded-lg" v-model="cardNumber" />
            <input type="text" placeholder="Expiration date (MM/YY)" class="w-full p-2 border rounded-lg" v-model="cardExpiry" />
            <input type="text" placeholder="CVV" class="w-full p-2 border rounded-lg" v-model="cardCvc" />
          </div>
        </div>
        <p v-if="paymentError" class="text-red-500 text-center mt-2">{{ paymentError }}</p>
        <p v-if="paymentSuccess" class="text-green-500 text-center mt-2">Payment Successful!</p>
        <div class="mt-6 flex flex-col space-y-2">
          <button @click="processPayment" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">
            {{ loading ? 'Processing...' : 'Pay Now' }}
          </button>
          <button class="w-full bg-gray-300 text-gray-600 py-2 rounded-lg" @click="cancelBooking">Back</button>
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
      },venue() {
            return this.$store.getters.getSelectedVenue;
        }
    },
    methods: {
        cancelBooking(){
        this.$router.back()
      },
      async processPayment() {
        this.loading = true;
        this.paymentError = "";
        this.paymentSuccess = false;
  
        if (!/^\d{16}$/.test(this.cardNumber)) {
          this.paymentError = "Invalid card number. Must be 16 digits.";
          this.loading = false;
          return;
        }
        let currentYear = new Date().getFullYear() % 100;
        let currentMonth = new Date().getMonth() + 1;
  
        let expiryMatch = this.cardExpiry.match(/^(\d{2})\/(\d{2})$/);
        if (!expiryMatch) {
          this.paymentError = "Invalid expiry date. Use MM/YY format.";
          this.loading = false;
          return;
        }
  
        let month = parseInt(expiryMatch[1], 10);
        let year = parseInt(expiryMatch[2], 10);
  
        if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
          this.paymentError = "Invalid expiry date";
          this.loading = false;
          return;
        }
  
        if (!/^\d{3,4}$/.test(this.cardCvc)) {
          this.paymentError = "Invalid CVV. Must be 3 or 4 digits.";
          this.loading = false;
          return;
        }
  
        setTimeout(() => {
          this.paymentSuccess = true;
          this.loading = false;
        }, 2000);
      },
    },
  };
  </script>
  
  <style scoped>
  </style>