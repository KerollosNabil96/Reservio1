<template>
  <div class="min-h-screen">
    <!-- Wallet Content -->
    <div class="dark:bg-gray-100 bg-gray-800 text-center p-6 rounded-lg shadow-lg">
      <h2 class="text-white text-2xl mb-4 dark:text-gray-800">
        Your Wallet Balance: {{ balance }} EGP
      </h2>
      <button
        @click="openPop"
        class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Withdraw
      </button>
    </div>

    <!-- First Popup: Enter Amount -->
    <div v-if="isActive" class="fixed inset-0">
      <div class="absolute inset-0 bg-black opacity-80"></div>
      <div class="absolute inset-0 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold mb-4">Enter the amount to withdraw</h3>

          <!-- Input with Currency Label -->
          <div class="flex items-center border border-gray-300 rounded mb-4">
            <input
              v-model="amount"
              type="number"
              min="0"
              placeholder="Amount"
              class="w-full p-2 outline-none"
            />
            <span class="p-2 bg-gray-200 border-l">EGP</span>
          </div>

          <div class="flex justify-end space-x-2">
            <button
              @click="closePop"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              @click="confirmWithdraw"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Confirm
            </button>
          </div>
          <p v-if="wrongAmount" class="text-center mt-2 text-red-700">Please enter a valid amount.</p>
        </div>
      </div>
    </div>

    <div v-if="isSuccess" class="fixed inset-0">
      <div class="absolute inset-0 bg-black opacity-80"></div>
      <div class="absolute inset-0 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          <h3 class="text-lg font-semibold mb-4 text-green-600">✅ Request Received!</h3>
          <p>Your withdrawal request has been received.</p>
          <p>We will contact you within 24 hours via email.</p>
          <button
            @click="closeSuccessPop"
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wallet',
  data() {
    return {
      isActive: false, 
      isSuccess: false, 
      amount: null,
      wrongAmount: false,
      balance: 500
    };
  },
  methods: {
    openPop() {
      this.isActive = true;
    },
    closePop() {
      this.isActive = false;
      this.amount = null;
      this.wrongAmount = false;
    },
    confirmWithdraw() {
      if (this.amount > 0 && this.amount<this.balance) {
        this.isActive = false; 
        this.isSuccess = true; 
      } else {
        this.wrongAmount = true;
      }
    },
    closeSuccessPop() {
      this.isSuccess = false; 
    }
  },
};
</script>

<style scoped>
</style>
