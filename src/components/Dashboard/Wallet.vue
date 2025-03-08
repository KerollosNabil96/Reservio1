<template>
  <div class="min-h-screen">
    <!-- Wallet Content -->
    <div
      class="dark:bg-gray-100 bg-gray-800 text-center p-6 rounded-lg shadow-lg flex justify-center items-center"
    >
      <h2 class="text-white text-2xl dark:text-gray-800">
        Your Wallet Balance:
        <span class="font-bold text-green-500 dark:text-green-700"
          >{{ balance }} EGP</span
        >
      </h2>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import store from "@/store/store";

export default {
  name: "Wallet",
  data() {
    return {
      isActive: false,
      isSuccess: false,
      amount: null,
      wrongAmount: false,
      balance: 0, // سيتم تحديثها من قاعدة البيانات
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
      if (this.amount > 0 && this.amount < this.balance) {
        this.isActive = false;
        this.isSuccess = true;
      } else {
        this.wrongAmount = true;
      }
    },
    closeSuccessPop() {
      this.isSuccess = false;
    },
    async fetchBalance() {
      const user = store.state.user; // جلب بيانات المستخدم من Vuex store
      if (!user) {
        console.error("No user found!");
        return;
      }

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.id}/balance`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          this.balance = snapshot.val(); // تحديث قيمة balance
        } else {
          console.log("No balance found for this user.");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    },
  },
  mounted() {
    this.fetchBalance();
  },
};
</script>

<style scoped></style>
