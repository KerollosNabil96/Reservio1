<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen mt-8 bg-gray-100 p-6 dark:bg-gray-800"
  >
    <div
      class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center dark:bg-gray-900"
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
          class="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full"
        >
          ✔
        </div>
      </div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
        Yay! Payment Completed
      </h2>
      <img
        src="../assets/pictures/still-0115b33dc67f039141dc54b5633bd103.webp"
        alt="Payment Completed"
        class="w-full h-50 rounded-xl object-cover my-4"
      />
      <p class="text-gray-500 text:bg-gray-200">
        Please check your email & phone message.<br />We have sent all the
        information.
      </p>
      <router-link to="/" class="text-blue-600 font-semibold mt-4 inline-block"
        >Go to Home →</router-link
      >
    </div>
  </div>
</template>

<script>
import router from "@/router";
import store from "@/store/store";
import { db, auth, ref, set, onValue } from "@/firebase";

export default {
  name: "PaymentSuccess",
  async created() {
    // Check both Firebase auth and store state
    const user = auth.currentUser;
    const storeUser = store.state.user;

    if (!user && storeUser) {
      console.log("Attempting to restore user session...");
      try {
        // Fetch user data from database using store user ID
        const userRef = ref(db, `users/${storeUser.id}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log("Found user data, restoring session...");
          store.dispatch("updateAuthState", userData);
        } else {
          console.warn("No user data found in database");
          store.dispatch("updateAuthState", null);
        }
      } catch (error) {
        console.error("Error restoring user session:", error);
        store.dispatch("updateAuthState", null);
      }
    }

    // Save booking info
    if (store.state.currentBookingInfo && store.state.user) {
      try {
        console.log("Saving booking info:", store.state.currentBookingInfo);
        let id = "id" + Math.random().toString(16).slice(2);
        const userRef = ref(
          db,
          `users/${store.state.user.id}/bookings/${id}`
        );
        await set(userRef, store.state.currentBookingInfo);
        console.log("Booking info saved successfully");
      } catch (error) {
        console.error("Error saving booking info:", error);
      }
    } else {
      console.warn("Missing booking info or user data");
    }
  },
};
</script>

<style scoped></style>
