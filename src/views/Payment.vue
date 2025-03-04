<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl  dark:bg-gray-900">
        <h2 class="text-2xl font-bold text-center text-blue-900 ">Payment</h2>
        <p class="text-gray-500 text-center mb-6 dark:text-white">Kindly follow the instructions below</p>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Side (Details) -->
          <div class="border-r pr-6">
            <h3 class="font-semibold text-lg text-gray-800  dark:text-white">Transfer Reservio:</h3>
            <p class="text-gray-600  dark:text-white">1 Day at {{ myFormData.venueName  }} - {{myFormData.selectedArea}}, {{myFormData.selectedCity}}</p>
            <p class="mt-4 text-lg font-bold text-blue-800">Total: 100 EGP</p>
          </div>
  
          <!-- Right Side (Payment Form) -->
          <div>
            <label class="block text-gray-700 font-medium  dark:text-white">Card Number</label>
            <input v-model="cardNumber" type="text" maxlength="16" pattern="\d{16}" class="p-2 border rounded-lg bg-white w-full  dark:text-white" placeholder="1234 5678 9012 3456" required>
  
            <label class="block mt-4 text-gray-700 font-medium  dark:text-white">Expiry Date (MM/YY)</label>
            <input v-model="cardExpiry" type="text" pattern="^(0[1-9]|1[0-2])\/\d{2}$" class="p-2 border rounded-lg bg-white w-full" placeholder="MM/YY" required>
  
            <label class="block mt-4 text-gray-700 font-medium  dark:text-white">CVV</label>
            <input v-model="cardCvc" type="text" maxlength="4" pattern="\d{3,4}" class="p-2 border rounded-lg bg-white w-full" placeholder="123" required>
          </div>
        </div>
  
        <!-- Buttons -->
        <div class="flex justify-between mt-6">
          <button 
            @click="processPayment" 
            class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition flex items-center"
            :disabled="loading"
          >
            <span v-if="loading" class="animate-spin mr-2">⏳</span>
            Pay Now
          </button>
          <button 
            @click="$router.go(-1)" 
            class="bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>
        </div>
  
        <!-- Success/Error Messages -->
        <p v-if="paymentSuccess" class="mt-4 text-green-600 font-medium text-center">
          ✅ Payment Successful! 🎉
        </p>
        <p v-if="paymentError" class="mt-4 text-red-600 font-medium text-center">
          ❌ {{ paymentError }}
        </p>
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
}
    ,
    methods: {
      async processPayment() {
        this.loading = true;
        this.paymentError = "";
        this.paymentSuccess = false;
  
        if (!/^\d{16}$/.test(this.cardNumber)) {
          this.paymentError = "Invalid card number. Must be 16 digits.";
          this.loading = false;
          return;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.cardExpiry)) {
          this.paymentError = "Invalid expiry date. Use MM/YY format.";
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