<template>
  <div class="main-content">
    <div class="booking-section">
      <div class="search-section mb-6 flex flex-col sm:flex-row gap-2">
        <div class="search-box w-full sm:w-11/12">
          <input type="search" v-model="searchQuery" placeholder="Search"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
        </div>
        <select v-model="sortOption"
          class="w-full sm:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white">
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
    <transition-group name="sort-animation" tag="div" v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="venue in sortedBookings" :key="venue.id"
        class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <!-- Venue Image -->
        <div class="relative">
          <img :src="venue.pictures[0]" :alt="venue.venueName" class="w-full h-52 object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          <div class="absolute bottom-3 left-3">
            <span
              class="bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full text-sm">
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
                {{ i <= Math.round(venue.averageRating) ? "★" : "☆" }} </span>
            </div>
            <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {{
                venue.averageRating
                  ? venue.averageRating.toFixed(1)
                  : "No ratings"
              }}
              <span v-if="venue.totalReviews > 0" class="ml-1">({{ venue.totalReviews }}
                {{ venue.totalReviews === 1 ? "review" : "reviews" }})</span>
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-4 dark:text-gray-300 line-clamp-2">
            {{ venue.shortDescription }}
          </p>

          <!-- Location and Date -->
          <div class="mt-auto flex items-center justify-between">
            <div class="flex items-center text-gray-500 dark:text-gray-400">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-xs">{{ venue.address.governorate }}</span>
            </div>
            <div class="flex items-center text-gray-500 dark:text-gray-400">
              <span class="text-xs">{{ venue.selectedDate }}</span>
            </div>
          </div>
          <div class="time-slots-grid mt-4">
            <div v-for="[timeslotId, timeslot] in filteredTimeSlots(venue.id)" :key="`${venue.id}-${timeslotId}`"
              class="time-slot-item">
              <div class="time-slot-content">
                <span>{{ timeslot.from }} - {{ timeslot.to }}</span>
                <button class="delete-icon" @click="openDeleteModal(venue.id, timeslotId)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- Show Bookings Button -->
          <button @click="showBookings(venue.id)"
            class="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Show User Bookings
          </button>
        </div>
      </div>
    </transition-group>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-6">
      <button @click="prevPageAndScroll" :disabled="currentPage === 1"
        class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
        Previous
      </button>
      <span class="text-gray-700 dark:text-gray-300">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPageAndScroll" :disabled="currentPage === totalPages"
        class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
        Next
      </button>
    </div>
  </div>
  <!-- Confirmation Modal -->
  <div v-if="showDeleteModal"
    class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center  z-50 transition-all duration-300"
    @click="closeDeleteModal">
    <div
      class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
      @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          Delete Time Slot
        </h3>
        <button @click="closeDeleteModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to delete this time slot?
      </p>
      <div class="flex justify-end gap-4">
        <button @click="closeDeleteModal"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
          Cancel
        </button>
        <button @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
          Delete
        </button>
      </div>
    </div>
  </div>
  <!-- Popup Modal -->
  <div v-if="showBooking"
    class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
    @click="showBooking = false">
    <div
      class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
      @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          User Bookings
        </h3>
        <button @click="showBooking = false"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <!-- Booking Details -->
      <div v-if="filteredBookings.length > 0">
        <ul class="space-y-2">
          <li v-for="booking in filteredBookings" :key="booking.id" class="text-gray-600 dark:text-gray-300">
            <div class="flex justify-between items-center">
              <div>
                <p><strong>User:</strong> {{ booking.username }}</p>
                <p><strong>Date:</strong> {{ booking.date }}</p>
                <p><strong>Payment Method:</strong> {{ booking.method }}</p>
              </div>
              <button @click="showUserDetails(booking.userId)"
                class="ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
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
        <button @click="showBooking = false"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- User Details Modal -->
  <div v-if="showUserModal"
    class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
    @click="showUserModal = false">
    <div
      class="bg-white/95 dark:bg-gray-800/95 rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
      @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          User Details
        </h3>
        <button @click="showUserModal = false"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- User Details -->
      <div v-if="filteredUsers.length > 0">
        <div v-for="user in filteredUsers" :key="user.id" class="text-gray-600 dark:text-gray-300">
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
        <button @click="showUserModal = false"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import VenueCard from "../reservations/VenueCard.vue";
import store from "@/store/store";
import { getDatabase, ref as dbRef, get, set } from "firebase/database";

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
      perWhat: "hour"
    };
  },
  async created() {
    try {
      const db = getDatabase();

      // Fetch bookings
      const bookingsSnapshot = await get(dbRef(db, "bookings"));
      if (bookingsSnapshot.exists()) {
        const bookingsData = bookingsSnapshot.val();
        this.bookings = Object.keys(bookingsData).map((key) => ({
          id: key,
          ...bookingsData[key],
        }));
      }

      // Fetch users
      const usersSnapshot = await get(dbRef(db, "users"));
      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();
        this.users = Object.keys(usersData).map((key) => ({
          id: key,
          ...usersData[key],
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  watch: {
    bookID(newBookID) {
      if (newBookID) {
        this.filteredBookings = this.bookings.filter((booking) => {
          return (
            booking.venueId === newBookID || booking.venue?.id === newBookID
          );
        });
      } else {
        this.filteredBookings = this.bookings;
      }
    },
    userID(newUserID) {
      if (newUserID) {
        this.filteredUsers = this.users.filter((user) => {
          return user.id === newUserID;
        });
      } else {
        this.filteredUsers = this.users;
      }
    }
  },
  methods: {
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
  if (this.selectedVenueId && this.selectedTimeSlotId !== null) {
    try {
      const db = getDatabase();

      // Fetch the specific time slot to update
      const timeSlotRef = dbRef(
        db,
        `venues/${this.selectedVenueId}/timeSlots/${this.selectedTimeSlotId}`
      );

      // Fetch the current time slot data
      const timeSlotSnapshot = await get(timeSlotRef);
      if (timeSlotSnapshot.exists()) {
        const timeSlotData = timeSlotSnapshot.val();

        // Update the `exist` field to `false`
        await set(timeSlotRef, { ...timeSlotData, exist: false });

        // Fetch all bookings
        const bookingsSnapshot = await get(dbRef(db, "bookings"));
        if (bookingsSnapshot.exists()) {
          const bookingsData = bookingsSnapshot.val();

          // Filter bookings for the specific venue and time slot
          const filteredBookings = Object.values(bookingsData).filter(
            (booking) =>
              booking.venue.id === this.selectedVenueId &&
              booking.timeSlotId === this.selectedTimeSlotId
          );

          // If there are bookings, notify the users and remove the bookings
          if (filteredBookings.length > 0) {
            // Fetch all users
            const usersSnapshot = await get(dbRef(db, "users"));
            if (usersSnapshot.exists()) {
              const usersData = usersSnapshot.val();

              // Send notifications to users who booked the time slot
              for (const booking of filteredBookings) {
                const user = usersData[booking.userId];
                if (user) {
                  // Create notification
                  const notification = {
                    id: Date.now().toString(),
                    message: this.$t("booking_canceled", {
                      venueName: booking.venue.venueName,
                      date: booking.date,
                    }),
                    timestamp: new Date().toISOString(),
                    read: false,
                    type: "booking_canceled",
                  };

                  // Save notification to the user's notifications collection
                  await set(
                    dbRef(
                      db,
                      `users/${booking.userId}/notifications/${notification.id}`
                    ),
                    notification
                  );

                  // Refund money to user's wallet if payment method was wallet
                  if (booking.method === "wallet") {
                    const userRef = dbRef(db, `users/${booking.userId}`);
                    const userSnapshot = await get(userRef);
                    
                    if (userSnapshot.exists()) {
                      const userData = userSnapshot.val();
                      const currentBalance = userData.balance || 0;
                      const refundAmount = booking.price || 0;
                      
                      // Update user's balance
                      await set(userRef, {
                        ...userData,
                        balance: currentBalance + refundAmount
                      });

                      // Create refund transaction record
                      const refundTransaction = {
                        id: Date.now().toString(),
                        amount: refundAmount,
                        type: "refund",
                        timestamp: new Date().toISOString(),
                        bookingId: booking.id,
                        venueName: booking.venue.venueName
                      };

                      await set(
                        dbRef(
                          db,
                          `users/${booking.userId}/transactions/${refundTransaction.id}`
                        ),
                        refundTransaction
                      );
                    }
                  }

                  // Remove the booking from the user's bookings
                  const userBookingRef = dbRef(
                    db,
                    `users/${booking.userId}/bookings/${booking.id}`
                  );
                  await set(userBookingRef, null);

                  console.log(`Notification and refund sent to user: ${user.email}`);
                }

                // Remove the booking from the global bookings collection
                const bookingRef = dbRef(db, `bookings/${booking.id}`);
                await set(bookingRef, null);
              }
            }
          }
        }

        // Update the local state (UI)
        this.updateTimeSlotStatus(
          this.selectedVenueId,
          this.selectedTimeSlotId,
          false
        );

        // Show success message
        this.showSuccess = true;
        this.successMessage = "Time slot deactivated and users refunded successfully.";
      } else {
        console.error("Time slot not found.");
        this.showError = true;
        this.errorMessage = "Time slot not found.";
      }
    } catch (error) {
      console.error("Error deactivating time slot:", error);
      this.showError = true;
      this.errorMessage =
        "Failed to deactivate time slot. Please try again.";
    }
  }
  this.closeDeleteModal();
},
    updateTimeSlotStatus(venueId, timeSlotId, existStatus) {
      const venueIndex = this.sortedBookings.findIndex(
        (venue) => venue.id === venueId
      );

      if (venueIndex !== -1) {
        // Create a new array to trigger reactivity
        const updatedBookings = [...this.sortedBookings];
        const venue = { ...updatedBookings[venueIndex] };

        // Update the time slot's `exist` status
        if (venue.timeSlots && venue.timeSlots[timeSlotId]) {
          venue.timeSlots = {
            ...venue.timeSlots,
            [timeSlotId]: {
              ...venue.timeSlots[timeSlotId],
              exist: existStatus
            }
          };
        }

        // Update the venue in the array
        updatedBookings[venueIndex] = venue;
        
        // Here you would update the source data that sortedBookings depends on
        // For example, if sortedBookings comes from a store, you'd update the store
        // This depends on your specific implementation
      }
    },
    async showUsersForSlot(venueId, timeSlotId) {
      try {
        const db = getDatabase();

        // Fetch all bookings
        const bookingsSnapshot = await get(dbRef(db, "bookings"));
        if (!bookingsSnapshot.exists()) {
          console.log("No bookings found.");
          return;
        }

        const bookingsData = bookingsSnapshot.val();

        // Filter bookings for the specific venue and time slot
        const filteredBookings = Object.values(bookingsData).filter(
          (booking) =>
            booking.venue.id === venueId && booking.timeSlotId === timeSlotId
        );

        if (filteredBookings.length === 0) {
          console.log("No bookings found for this time slot.");
          return;
        }

        // Fetch all users
        const usersSnapshot = await get(dbRef(db, "users"));
        if (!usersSnapshot.exists()) {
          console.log("No users found.");
          return;
        }

        const usersData = usersSnapshot.val();

        // Match bookings with users
        const usersForSlot = filteredBookings.map((booking) => {
          const user = usersData[booking.userId];
          return {
            userId: booking.userId,
            username: user?.username || "Unknown User",
            email: user?.email || "No Email",
            phone: user?.phone || "No Phone",
          };
        });

        // Log the user details to the console
        console.log("Users who booked this time slot:", usersForSlot);
      } catch (error) {
        console.error("Error fetching user details for time slot:", error);
      }
    },
    nextPageAndScroll() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.scrollToTop();
      }
    },
    prevPageAndScroll() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.scrollToTop();
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  computed: {
    filteredVenues() {
      const userVenues = store.getters.getReservations.filter((ele) => {
        return this.$store.state.user.email == ele.owner;
      });
      // Filter by search query
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        return userVenues.filter((venue) => {
          return (
            venue.venueName.toLowerCase().includes(searchLower) ||
            venue.address.city.toLowerCase().includes(searchLower) ||
            venue.address.governorate.toLowerCase().includes(searchLower)
          );
        });
      }
      return userVenues;
    },
    sortedBookings() {
      let sorted = [...this.filteredVenues];
      // Sort by date
      if (this.sortOption === "nearest") {
        sorted.sort(
          (a, b) => new Date(a.selectedDate) - new Date(b.selectedDate)
        );
      } else if (this.sortOption === "farthest") {
        sorted.sort(
          (a, b) => new Date(b.selectedDate) - new Date(a.selectedDate)
        );
      }
      console.log("sorted arr ", sorted);
      return sorted.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    },
    filteredTimeSlots() {
      return (venueId) => {
        const venue = this.sortedBookings.find((venue) => venue.id === venueId);
        if (venue && venue.timeSlots) {
          return Object.entries(venue.timeSlots).filter(
            ([_, timeslot]) => timeslot.exist === true
          );
        }
        return [];
      };
    },
    totalPages() {
      return Math.ceil(this.filteredVenues.length / this.itemsPerPage);
    },
  }
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
