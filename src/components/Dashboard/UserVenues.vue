<template>
  <div class="main-content">
    <div class="booking-section">
      <div class="search-section mb-6 flex flex-col sm:flex-row gap-2">
        <div class="search-box w-full sm:w-11/12">
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Search"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          v-model="sortOption"
          class="w-full sm:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="all" disabled>All</option>
          <option value="nearest">Nearest Date</option>
          <option value="farthest">Farthest Date</option>
        </select>
      </div>
      <div class="booking-header text-xl md:text-2xl font-bold dark:text-white">
        <h1 class="text-2xl font-bold text-green-600 mb-6">Venues List</h1>
      </div>
    </div>

    <div v-if="sortedBookings.length === 0" class="no-bookings">
      <p>No Venues To Display</p>
    </div>
    <transition-group
      name="sort-animation"
      tag="div"
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <div
        v-for="venue in sortedBookings"
        :key="venue.id"
        class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <!-- Venue Image -->
        <div class="relative">
          <img
            :src="venue.pictures[0]"
            :alt="venue.venueName"
            class="w-full h-52 object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
          ></div>
          <div class="absolute bottom-3 left-3">
            <span
              class="bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full text-sm"
            >
              {{ venue.price }} EGP/ {{ perWhat }}
            </span>
          </div>
        </div>

        <!-- Venue Details -->
        <div class="p-5 flex flex-col flex-grow">
          <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            {{ venue.venueName }}
          </h3>
          <div class="flex items-center mb-2">
            <div class="text-yellow-400 flex">
              <span v-for="i in 5" :key="i" class="text-lg">
                {{ i <= Math.round(venue.averageRating) ? "★" : "☆" }}
              </span>
            </div>
            <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {{
                venue.averageRating
                  ? venue.averageRating.toFixed(1)
                  : "No ratings"
              }}
              <span v-if="venue.totalReviews > 0" class="ml-1"
                >({{ venue.totalReviews }}
                {{ venue.totalReviews === 1 ? "review" : "reviews" }})</span
              >
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-4 dark:text-gray-300 line-clamp-2">
            {{ venue.shortDescription }}
          </p>

          <!-- Location and Date -->
          <div class="mt-auto flex items-center justify-between">
            <div class="flex items-center text-gray-500 dark:text-gray-400">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="text-xs">{{ venue.address.governorate }}</span>
            </div>
            <div class="flex items-center text-gray-500 dark:text-gray-400">
              <span class="text-xs">{{ venue.selectedDate }}</span>
            </div>
          </div>
          <div class="time-slots-grid mt-4">
            <div
              v-for="[timeslotId, timeslot] in filteredTimeSlots(venue.id)"
              :key="`${venue.id}-${timeslotId}`"
              class="time-slot-item"
            >
              <div class="time-slot-content">
                <span>{{ timeslot.from }} - {{ timeslot.to }}</span>
                <button
                  class="delete-icon"
                  @click="openDeleteModal(venue.id, timeslotId)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- Show Bookings Button -->
          <button
            @click="showBookings(venue.id)"
            class="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Show User Bookings
          </button>
        </div>
      </div>
    </transition-group>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-6">
      <button
        @click="prevPageAndScroll"
        :disabled="currentPage === 1"
        class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        Previous
      </button>
      <span class="text-gray-700 dark:text-gray-300"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <button
        @click="nextPageAndScroll"
        :disabled="currentPage === totalPages"
        class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        Next
      </button>
    </div>
  </div>
  <!-- Confirmation Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
    @click="closeDeleteModal"
  >
    <div
      class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          Delete Time Slot
        </h3>
        <button
          @click="closeDeleteModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to delete this time slot?
      </p>
      <div class="flex justify-end gap-4">
        <button
          @click="closeDeleteModal"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
  <!-- Popup Modal -->
  <div
    v-if="showBooking"
    class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
    @click="showBooking = false"
  >
    <div
      class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          User Bookings
        </h3>
        <button
          @click="showBooking = false"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <!-- Booking Details -->
      <div v-if="filteredBookings.length > 0">
        <ul class="space-y-2">
          <li
            v-for="booking in filteredBookings"
            :key="booking.id"
            class="text-gray-600 dark:text-gray-300"
          >
            <div class="flex justify-between items-center">
              <div>
                <p><strong>User:</strong> {{ booking.username }}</p>
                <p><strong>Date:</strong> {{ booking.date }}</p>
                <p><strong>Payment Method:</strong> {{ booking.method }}</p>
              </div>
              <button
                @click="showUserDetails(booking.userId)"
                class="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                Details
              </button>
            </div>
            <hr class="my-3" />
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-gray-600 dark:text-gray-300">
          No bookings found for this venue.
        </p>
      </div>

      <!-- Close Button -->
      <div class="flex justify-end mt-6">
        <button
          @click="showBooking = false"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- User Details Modal -->
  <div
    v-if="showUserModal"
    class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
    @click="showUserModal = false"
  >
    <div
      class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          User Details
        </h3>
        <button
          @click="showUserModal = false"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- User Details -->
      <div v-if="filteredUsers.length > 0">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="text-gray-600 dark:text-gray-300"
        >
          <p class="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Name:</strong> {{ user.name }}
          </p>
          <p class="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Email:</strong> {{ user.email }}
          </p>
          <p class="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Phone:</strong> {{ user.phone }}
          </p>
          <!-- Add more user details as needed -->
        </div>
      </div>
      <!-- Close Button -->
      <div class="flex justify-end mt-6">
        <button
          @click="showUserModal = false"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import VenueCard from "../reservations/VenueCard.vue";
import store from "@/store/store";
import { getDatabase, ref as dbRef, get, set, remove } from "firebase/database";

export default {
  data() {
    return {
      searchQuery: "",
      sortOption: "all",
      showBooking: false,
      showUserModal: false,
      selectedVenue: null,
      bookID: "",
      userID: "",
      showDeleteModal: false,
      selectedVenueId: null,
      selectedTimeSlotId: null,
      currentPage: 1,
      itemsPerPage: 6,
      bookings: [],
      users: [],
      filteredBookings: [],
      filteredUsers: [],
      showSuccess: false,
      successMessage: "",
      showError: false,
      errorMessage: "",
      perWhat: "hour",
    };
  },
  async created() {
    await this.fetchData();
  },
  watch: {
    bookID(newBookID) {
      this.updateFilteredBookings(newBookID);
    },
    userID(newUserID) {
      this.updateFilteredUsers(newUserID);
    },
  },
  methods: {
    async fetchData() {
      try {
        const db = getDatabase();

        // Fetch bookings
        const bookingsSnapshot = await get(dbRef(db, "bookings"));
        if (bookingsSnapshot.exists()) {
          this.bookings = Object.keys(bookingsSnapshot.val()).map((key) => ({
            id: key,
            ...bookingsSnapshot.val()[key],
          }));
        }

        // Fetch users
        const usersSnapshot = await get(dbRef(db, "users"));
        if (usersSnapshot.exists()) {
          this.users = Object.keys(usersSnapshot.val()).map((key) => ({
            id: key,
            ...usersSnapshot.val()[key],
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        this.showError = true;
        this.errorMessage = "Failed to load data. Please refresh the page.";
      }
    },

    updateFilteredBookings(venueId) {
      if (venueId) {
        this.filteredBookings = this.bookings.filter(
          (booking) =>
            booking.venueId === venueId || booking.venue?.id === venueId
        );
      } else {
        this.filteredBookings = this.bookings;
      }
    },

    updateFilteredUsers(userId) {
      if (userId) {
        this.filteredUsers = this.users.filter((user) => user.id === userId);
      } else {
        this.filteredUsers = this.users;
      }
    },

    showBookings(venueId) {
      this.bookID = venueId;
      this.showBooking = true;
    },

    showUserDetails(userId) {
      this.userID = userId;
      this.showUserModal = true;
    },

    openDeleteModal(venueId, timeSlotId) {
      this.selectedVenueId = venueId;
      this.selectedTimeSlotId = timeSlotId;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedVenueId = null;
      this.selectedTimeSlotId = null;
    },

    async confirmDelete() {
      if (!this.selectedVenueId || this.selectedTimeSlotId === null) return;

      try {
        const db = getDatabase();

        // 1. Update the time slot to mark as not existing
        const timeSlotRef = dbRef(
          db,
          `venues/${this.selectedVenueId}/timeSlots/${this.selectedTimeSlotId}`
        );

        const timeSlotSnapshot = await get(timeSlotRef);
        if (!timeSlotSnapshot.exists()) {
          throw new Error("Time slot not found");
        }

        await set(timeSlotRef, {
          ...timeSlotSnapshot.val(),
          exist: false,
        });

        // 2. Process all bookings for this time slot
        const bookingsForSlot = this.bookings.filter(
          (booking) =>
            booking.venue?.id === this.selectedVenueId &&
            booking.timeSlotId === this.selectedTimeSlotId
        );

        for (const booking of bookingsForSlot) {
          await this.processBookingRefund(db, booking);
        }

        // 3. Update UI
        this.updateTimeSlotStatus(
          this.selectedVenueId,
          this.selectedTimeSlotId,
          false
        );

        // 4. Show success
        this.showSuccess = true;
        this.successMessage =
          "Time slot removed and users refunded successfully.";
      } catch (error) {
        console.error("Error in confirmDelete:", error);
        this.showError = true;
        this.errorMessage = "Failed to process. Please try again.";
      } finally {
        this.closeDeleteModal();
      }
    },

    async processBookingRefund(db, booking) {
      try {
        // 1. Send notification to user
        await this.sendNotification(db, booking);

        // 2. Process refund if payment was via wallet
        if (booking.method === "wallet") {
          await this.processWalletRefund(db, booking);
        }

        // 3. Remove booking from user's bookings
        const userBookingRef = dbRef(
          db,
          `users/${booking.userId}/bookings/${booking.id}`
        );
        await remove(userBookingRef);

        // 4. Remove booking from global bookings
        const globalBookingRef = dbRef(db, `bookings/${booking.id}`);
        await remove(globalBookingRef);
      } catch (error) {
        console.error(`Error processing booking ${booking.id}:`, error);
        throw error;
      }
    },

    async sendNotification(db, booking) {
      const notificationRef = dbRef(
        db,
        `users/${booking.userId}/notifications/${Date.now()}`
      );

      await set(notificationRef, {
        id: notificationRef.key,
        message: `Your booking at ${booking.venue.venueName} on ${booking.date} has been canceled and refunded`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "booking_canceled",
      });
    },

    async processWalletRefund(db, booking) {
      const userRef = dbRef(db, `users/${booking.userId}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const currentBalance = userData.balance || 0;
        const refundAmount = booking.price || 0;

        // Update user balance
        await set(userRef, {
          ...userData,
          balance: currentBalance + refundAmount,
        });

        // Record transaction
        const transactionRef = dbRef(
          db,
          `users/${booking.userId}/transactions/${Date.now()}`
        );

        await set(transactionRef, {
          id: transactionRef.key,
          amount: refundAmount,
          type: "refund",
          description: `Refund for canceled booking at ${booking.venue.venueName}`,
          timestamp: new Date().toISOString(),
          bookingDate: booking.date,
          status: "completed",
        });
      }
    },

    updateTimeSlotStatus(venueId, timeSlotId, existStatus) {
      const venueIndex = this.sortedBookings.findIndex((v) => v.id === venueId);
      if (venueIndex === -1) return;

      const updatedBookings = [...this.sortedBookings];
      const venue = { ...updatedBookings[venueIndex] };

      if (venue.timeSlots && venue.timeSlots[timeSlotId]) {
        venue.timeSlots = {
          ...venue.timeSlots,
          [timeSlotId]: {
            ...venue.timeSlots[timeSlotId],
            exist: existStatus,
          },
        };
        updatedBookings[venueIndex] = venue;
        // Update your store or data source here as needed
      }
    },

    // Rest of your existing methods remain unchanged
    showUsersForSlot() {
      /* ... */
    },
    nextPageAndScroll() {
      /* ... */
    },
    prevPageAndScroll() {
      /* ... */
    },
    scrollToTop() {
      /* ... */
    },
  },
  computed: {
    filteredVenues() {
      const userVenues = store.getters.getReservations.filter(
        (ele) => this.$store.state.user.email == ele.owner
      );

      if (!this.searchQuery) return userVenues;

      const searchLower = this.searchQuery.toLowerCase();
      return userVenues.filter(
        (venue) =>
          venue.venueName.toLowerCase().includes(searchLower) ||
          venue.address.city.toLowerCase().includes(searchLower) ||
          venue.address.governorate.toLowerCase().includes(searchLower)
      );
    },

    sortedBookings() {
      let sorted = [...this.filteredVenues];

      if (this.sortOption === "nearest") {
        sorted.sort(
          (a, b) => new Date(a.selectedDate) - new Date(b.selectedDate)
        );
      } else if (this.sortOption === "farthest") {
        sorted.sort(
          (a, b) => new Date(b.selectedDate) - new Date(a.selectedDate)
        );
      }

      return sorted.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    },

    filteredTimeSlots() {
      return (venueId) => {
        const venue = this.sortedBookings.find((v) => v.id === venueId);
        return venue?.timeSlots
          ? Object.entries(venue.timeSlots).filter(
              ([_, ts]) => ts.exist === true
            )
          : [];
      };
    },

    totalPages() {
      return Math.ceil(this.filteredVenues.length / this.itemsPerPage);
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

.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.no-bookings {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.time-slot-item {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.time-slot-item:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.time-slot-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #374151;
}

.delete-icon {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
}

.delete-icon:hover {
  color: #dc2626;
}

.dark .time-slot-item {
  background-color: #1f2937;
  border-color: #374151;
  color: #f3f4f6;
}

.dark .time-slot-item:hover {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .time-slot-content {
  color: #f3f4f6;
}

.dark .delete-icon {
  color: #ef4444;
}

.dark .delete-icon:hover {
  color: #dc2626;
}
</style>
