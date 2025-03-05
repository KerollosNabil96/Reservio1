<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800"
  >
    <div
      class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl dark:bg-gray-900"
    >
      <h2 class="text-2xl font-bold text-center text-blue-900">Payment</h2>
      <p class="text-gray-500 text-center mb-6 dark:text-white">
        Kindly follow the instructions below
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border-r pr-6">
          <h3 class="font-semibold text-lg text-gray-800 dark:text-white">
            Transfer Reservio:
          </h3>
          <p class="text-gray-600 dark:text-white">
            1 Day at {{ venueName }} - {{ city }},
            {{ governorate }}
          </p>
          <p class="mt-4 text-lg font-bold text-blue-800">
            Total: {{ price }} EGP
          </p>
        </div>

        <div>
          <label class="block text-gray-700 font-medium dark:text-white"
            >Card Number</label
          >
          <input
            v-model="cardNumber"
            type="text"
            maxlength="16"
            pattern="\d{16}"
            class="p-2 border rounded-lg bg-white w-full"
            placeholder="1234 5678 9012 3456"
            required
          />

          <label class="block mt-4 text-gray-700 font-medium dark:text-white"
            >Expiry Date (MM/YY)</label
          >
          <input
            v-model="cardExpiry"
            type="text"
            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
            class="p-2 border rounded-lg bg-white w-full"
            placeholder="MM/YY"
            required
          />

          <label class="block mt-4 text-gray-700 font-medium dark:text-white"
            >CVV</label
          >
          <input
            v-model="cardCvc"
            type="text"
            maxlength="4"
            pattern="\d{3,4}"
            class="p-2 border rounded-lg bg-white w-full"
            placeholder="123"
            required
          />
        </div>
      </div>

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

      <p
        v-if="paymentSuccess"
        class="mt-4 text-green-600 font-medium text-center"
      >
        ✅ Payment Successful! 🎉
      </p>
      <p v-if="paymentError" class="mt-4 text-red-600 font-medium text-center">
        ❌ {{ paymentError }}
      </p>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import { db, ref, set, onValue } from "../firebase";
import { getAuth } from "firebase/auth";

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
    venueName() {
      return this.$store.state.myFormData.venueName;
    },
    governorate() {
      return this.$store.state.myFormData.address?.governorate;
    },
    city() {
      return this.$store.state.myFormData.address?.city;
    },
    price() {
      return this.$store.state.myFormData.price;
    },
  },
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
      let currentYear = new Date().getFullYear() % 100; //last 2 digit in this yr
      let currentMonth = new Date().getMonth() + 1; //this month

      let expiryMatch = this.cardExpiry.match(/^(\d{2})\/(\d{2})$/); // match regex
      if (!expiryMatch) {
        this.paymentError = "Invalid expiry date. Use MM/YY format.";
        this.loading = false;
        return;
      }

      let month = parseInt(expiryMatch[1], 10);
      let year = parseInt(expiryMatch[2], 10);

      if (
        month < 1 ||
        month > 12 ||
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        this.paymentError = "Invalid expiry date";
        this.loading = false;
        return;
      }
      if (!/^\d{3,4}$/.test(this.cardCvc)) {
        this.paymentError = "Invalid CVV. Must be 3 or 4 digits.";
        this.loading = false;
        return;
      }
      let cardInfo = {
        cardNum: this.cardNumber,
        expiryDate: this.cardExpiry,
        CVC: this.cardCvc,
      };
      store.state.myFormData = { ...store.state.myFormData, cardInfo };

      setTimeout(() => {
        this.paymentSuccess = true;
        // const reference = ref(
        //   db,
        //   `users/${store.state.user.username}/venues/${store.state.myFormData.venueName}`
        // );
        const requestsRef = ref(
          db,
          "requests/" + store.state.myFormData.venueName
        );
        // set(reference, store.state.myFormData);
        set(requestsRef, store.state.myFormData);
        this.loading = false;
        this.$router.push(`/`);
      }, 2000);
    },
  },
};
</script>
<style scoped></style>
