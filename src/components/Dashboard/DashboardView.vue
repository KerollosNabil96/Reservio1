<template>
  <div class="flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
    <div class="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">User Dashboard</h1>
      <button @click="toggleSidebar" class="text-gray-700 dark:text-gray-300 focus:outline-none">
        <i class="fas fa-bars text-xl"></i>
      </button>
    </div>

    <SideBar :sidebarOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <div :class="['flex-1 p-4 md:p-8 overflow-auto dark:bg-gray-900', sidebarOpen ? 'pt-16 md:pt-0' : '']">
      <div class="header-section mb-6">
        <h2 class="text-2xl md:text-3xl font-bold dark:text-white">
          Hello, <span :style="{ color: 'rgb(18, 102, 212)' }">{{ username }}</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-400">Have a nice day!</p>
      </div>

      <div v-if="$route.path === '/profile/bookings'">
        <div class="search-section mb-6 flex flex-col sm:flex-row items-center gap-2 bg-gray-800 p-2 rounded-lg">
          <input type="search" v-model="searchQuery" placeholder="Search" class="w-full sm:flex-grow p-2 bg-gray-900 text-white border-none rounded-lg focus:outline-none mb-2 sm:mb-0" />
          <select v-model="sortOption" class="w-full sm:w-auto p-2 bg-gray-900 text-white border-none rounded-lg focus:outline-none">
            <option value="all">All</option>
            <option value="nearest">Nearest Date</option>
            <option value="farthest">Farthest Date</option>
          </select>
        </div>

        <div class="dashboard">
          <h1 class="text-2xl font-bold text-green-600 mb-6">Booking List</h1>

          <div v-if="sortedBookings.length === 0" class="no-bookings">
            <p class="text-gray-600 dark:text-gray-400">No Bookings To Display</p>
          </div>

          <transition-group name="sort-animation" tag="div" class="bookings-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="booking in sortedBookings" :key="booking.id" class="booking-card bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col">
              <div class="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img v-if="booking.venue.pictures && booking.venue.pictures.length > 0" :src="booking.venue.pictures[0]" alt="Booking Image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <i class="fas fa-image text-4xl"></i>
                </div>
              </div>

              <h3 class="text-xl font-bold text-green-600 dark:text-green-400 mb-2 truncate">{{ booking.venue.venueName }}</h3>
              <div class="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                <i class="fas fa-calendar-alt mr-2"></i>
                <span>{{ formatDate(booking.date) }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                <i class="fas fa-map-marker-alt mr-2"></i>
                <span>{{ booking.venue.address.city }}, {{ booking.venue.address.governorate }}</span>
              </div>

              <div class="mt-auto flex justify-between items-center">
                <span class="text-lg font-semibold text-green-600 dark:text-green-400">{{ booking.venue.price }} EGP/hour</span>
              </div>

              <button @click="cancelBooking(booking)" class="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Cancel Booking</button>
            </div>
          </transition-group>
        </div>
      </div>

      <router-view></router-view>
    </div>

    <!-- Popup Modal -->
    <div
      v-if="showBooking"
      ref="popupModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-[100] transition-all duration-300"
      @click="showBooking = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-auto my-auto sm:mx-8 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] relative"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Cancel Booking
          </h3>
          <button
            @click="showBooking = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to cancel this booking? You will receive a 80% refund.</p>
        <div class="flex justify-end gap-2">
          <button
            ref="cancelPopupFocus"
            @click="showBooking = false"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            No, Keep it
          </button>
          <button
            @click="confirmCancelBooking"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Error Popup Modal -->
    <div
      v-if="showError"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-[100] transition-all duration-300"
      @click="showError = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-auto my-auto sm:mx-8 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] relative"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-red-600 dark:text-red-400">
            Error
          </h3>
          <button
            @click="showError = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ errorMessage }}</p>
        <div class="flex justify-end">
          <button
            ref="errorPopupFocus"
            @click="showError = false"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Success Popup Modal -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-[100] transition-all duration-300"
      @click="showSuccess = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-auto my-auto sm:mx-8 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] relative"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-green-600 dark:text-green-400">
            Success
          </h3>
          <button
            @click="showSuccess = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ successMessage }}</p>
        <div class="flex justify-end">
          <button
            ref="successPopupFocus"
            @click="showSuccess = false"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { ref as firebaseRef, onValue, set, get } from "firebase/database";
import SideBar from "../SideBar/SideBar.vue";
import { getAuth } from "firebase/auth";
import { nextTick } from "vue";

export default {
  name: "DashboardView",
  components: { SideBar },
  data() {
    return {
      bookings: [],
      searchQuery: "",
      sortOption: "all",
      sidebarOpen: true,
      userId: null,
      showBooking: false,
      selectedBooking: null,
      showError: false,
      errorMessage: '',
      showSuccess: false,
      successMessage: ''
    };
  },
  computed: {
    username() {
      return this.$store?.state?.user?.name || "Guest";
    },
    filteredBookings() {
      return this.bookings.filter(booking => booking.venue.venueName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    sortedBookings() {
      let sorted = [...this.filteredBookings];
      if (this.sortOption === "nearest") sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      else if (this.sortOption === "farthest") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      return sorted;
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    toggleSidebar(value) {
      this.sidebarOpen = value !== undefined ? value : !this.sidebarOpen;
    },
    cancelBooking(booking) {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      const timeDifference = bookingDate - today;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (daysDifference <= 1) {
        this.errorMessage = "You can't cancel a booking within 24 hours.";
        this.showError = true;
        return;
      }

      this.selectedBooking = booking;
      this.showBooking = true;

      nextTick(() => {
        this.$refs.cancelPopupFocus?.focus();
      });
    },
    async confirmCancelBooking() {
      const booking = this.selectedBooking;
      const dbRef = firebaseRef(db, `bookings/${booking.id}`);
      const userRef = firebaseRef(db, `users/${this.userId}/balance`);
      const venueRef = firebaseRef(db, `venues/${booking.venue.id}`);

      try {
        const [balanceSnapshot, venueSnapshot] = await Promise.all([
          get(userRef),
          get(venueRef)
        ]);

        const currentBalance = balanceSnapshot.exists() ? balanceSnapshot.val() : 0;
        const venueData = venueSnapshot.exists() ? venueSnapshot.val() : null;

        if (!venueData) {
          throw new Error('Venue data not found');
        }

        const refundAmount = booking.venue.price * 0.8;
        await set(userRef, currentBalance + refundAmount);

        if (venueData.timeSlots && booking.timeSlotId !== undefined) {
          const updatedTimeSlots = { ...venueData.timeSlots };
          if (updatedTimeSlots[booking.timeSlotId]) {
            updatedTimeSlots[booking.timeSlotId].available = (updatedTimeSlots[booking.timeSlotId].available || 0) + 1;
            await set(venueRef, {
              ...venueData,
              timeSlots: updatedTimeSlots
            });
          }
        }

        await set(dbRef, null);
        this.bookings = this.bookings.filter(b => b.id !== booking.id);
        this.showBooking = false;
        this.showSuccess = true;
        this.successMessage = `Your booking has been cancelled and ${refundAmount} EGP has been refunded to your balance.`;

        nextTick(() => {
          this.$refs.successPopupFocus?.focus();
        });
      } catch (error) {
        console.error('Error during booking cancellation:', error);
        this.errorMessage = "Failed to cancel booking. Please try again.";
        this.showError = true;

        nextTick(() => {
          this.$refs.errorPopupFocus?.focus();
        });
      }
    },
    setupBookingsListener() {
      getAuth().onAuthStateChanged(user => {
        if (user) {
          this.userId = user.uid;
          onValue(firebaseRef(db, "bookings"), snapshot => {
            this.bookings = snapshot.val() ? Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] })) : [];
          });
        }
      });
    },
  },
  mounted() {
    this.setupBookingsListener();
  },
  watch: {
    showError(newVal) {
      if (newVal) {
        nextTick(() => {
          this.$refs.errorPopupFocus?.focus();
        });
      }
    },
    showSuccess(newVal) {
      if (newVal) {
        nextTick(() => {
          this.$refs.successPopupFocus?.focus();
        });
      }
    },
  },
};
</script>

<style scoped>

.sort-animation-move, 
.sort-animation-enter-active,
.sort-animation-leave-active {
  transition: all 0.5s ease;
}

.sort-animation-enter-from,
.sort-animation-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.sort-animation-leave-active {
  position: absolute;
}

.dark .sort-animation-move,
.dark .sort-animation-enter-active,
.dark .sort-animation-leave-active {
  transition: all 0.5s ease;
}

.dark .sort-animation-enter-from,
.dark .sort-animation-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.dark .sort-animation-leave-active {
  position: absolute;
}
</style>