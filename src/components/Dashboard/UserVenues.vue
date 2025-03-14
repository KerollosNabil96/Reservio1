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
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
              v-for="(timeslot, timeslotId) in venue.timeSlots"
              :key="`${venue.id}-${timeslotId}`"
              class="time-slot-item"
            >
              <div v-if="timeslot" class="time-slot-content">
                <!-- Check if timeslot exists -->
                <span>{{ timeslot.from }} - {{ timeslot.to }}</span>
                <button
                  class="delete-icon"
                  @click="openDeleteModal(timeslotId)"
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
          <p class="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Address:</strong> {{ user.address }}
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
import { onMounted, ref, watch } from "vue";
import { getDatabase, ref as dbRef, get, set } from "firebase/database";

export default {
  data() {
    return {
      searchQuery: "",
      sortOption: "all",
      showBooking: false, // Controls the visibility of the popup
      showUserModal: false,
      selectedVenue: null, // Stores the selected venue for the popup
      bookID: "",
      userID: "", // selectedUser: null,
      showDeleteModal: false,
      selectedTimeSlotId: null,
    };
  },
  methods: {
    showBookings(venueId) {
      this.bookID = venueId; // Set the selected venue
      this.showBooking = true; // Show the popup
    },
    showUserDetails(userId) {
      this.userID = userId;
      this.showUserModal = true; // Show the user details modal
    },
    openDeleteModal(timeSlotId) {
      console.log(timeSlotId);

      this.selectedTimeSlotId = timeSlotId;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedTimeSlotId = null;
    },
    ////////////////
    async confirmDelete() {
      if (this.selectedTimeSlotId !== null) {
        try {
          const db = getDatabase();
          const venueId = this.findVenueIdByTimeSlotId(this.selectedTimeSlotId);

          if (venueId) {
            // Convert timeSlotId to string to ensure consistency
            const timeSlotIdStr = String(this.selectedTimeSlotId);

            // Reference to the time slot in the database
            const timeSlotRef = dbRef(
              db,
              `venues/${venueId}/timeSlots/${timeSlotIdStr}`
            );

            // Delete the time slot from the database
            await set(timeSlotRef, null);

            // Update the local state (UI)
            this.deleteTimeSlot(timeSlotIdStr);

            // Show success message
            this.showSuccess = true;
            this.successMessage = "Time slot deleted successfully.";
          } else {
            throw new Error("Venue not found for the selected time slot.");
          }
        } catch (error) {
          console.error("Error deleting time slot:", error);
          this.showError = true;
          this.errorMessage = "Failed to delete time slot. Please try again.";
        }
      }
      this.closeDeleteModal();
    },
    ////////////////
    deleteTimeSlot(timeSlotId) {
      // Convert timeSlotId to string to ensure consistency
      const timeSlotIdStr = String(timeSlotId);

      // Find the venue that contains the time slot
      const venueIndex = this.sortedBookings.findIndex(
        (venue) => venue.timeSlots && venue.timeSlots[timeSlotIdStr]
      );

      if (venueIndex !== -1) {
        // Create a copy of the venue to ensure reactivity
        const venue = { ...this.sortedBookings[venueIndex] };

        // Remove the time slot from the venue's timeSlots object
        const { [timeSlotIdStr]: _, ...remainingSlots } = venue.timeSlots;

        // Replace the entire timeSlots object to trigger reactivity
        venue.timeSlots = remainingSlots;

        // Update the sortedBookings array reactively
        this.sortedBookings.splice(venueIndex, 1, venue);
      }
    },
    ////////////////
    findVenueIdByTimeSlotId(timeSlotId) {
      const timeSlotIdStr = String(timeSlotId);
      const venue = this.sortedBookings.find(
        (venue) => venue.timeSlots && venue.timeSlots[timeSlotIdStr]
      );
      return venue ? venue.id : null;
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
      return sorted;
    },
  },
  setup() {
    const bookings = ref([]);
    const filteredBookings = ref([]);
    const bookID = ref("");
    const users = ref([]); // Add a ref for users
    const filteredUsers = ref([]);
    const userID = ref("");

    // Fetch bookings and users from Firebase
    onMounted(async () => {
      try {
        const db = getDatabase();

        // Fetch bookings
        const bookingsSnapshot = await get(dbRef(db, "bookings"));
        if (bookingsSnapshot.exists()) {
          const bookingsData = bookingsSnapshot.val();
          bookings.value = Object.keys(bookingsData).map((key) => ({
            id: key,
            ...bookingsData[key],
          }));
          console.log("Bookings fetched:", bookings.value); // Debugging
        }

        // Fetch users
        const usersSnapshot = await get(dbRef(db, "users"));
        if (usersSnapshot.exists()) {
          const usersData = usersSnapshot.val();
          users.value = Object.keys(usersData).map((key) => ({
            id: key,
            ...usersData[key],
          }));
          console.log("Users fetched:", users.value); // Debugging
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    // Watch for changes in bookID and filter bookings
    watch(bookID, (newBookID) => {
      if (newBookID) {
        console.log("Filtering bookings for venue ID:", newBookID); // Debugging
        const filtered = bookings.value.filter((booking) => {
          return (
            booking.venueId === newBookID || booking.venue?.id === newBookID
          ); // Filter by venueId or venue.id
        });
        console.log("Filtered Bookings:", filtered); // Debugging
        filteredBookings.value = filtered;
      } else {
        filteredBookings.value = bookings.value;
      }
    });

    // Watch for changes in userID and filter users
    watch(userID, (newUserID) => {
      if (newUserID) {
        console.log("Filtering users for user ID:", newUserID); // Debugging
        const filtered = users.value.filter((user) => {
          return user.id === newUserID; // Filter by user ID
        });
        console.log("Filtered Users:", filtered); // Debugging
        filteredUsers.value = filtered;
        console.log(filteredUsers);
      } else {
        filteredUsers.value = users.value;
      }
    });

    return {
      bookings,
      filteredBookings,
      bookID,
      users,
      filteredUsers,
      userID,
    };
  },
};
</script>

<style scoped>
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
  background-color: #ffffff; /* White background */
  border: 1px solid #e5e7eb; /* Light gray border */
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow */
}

.time-slot-item:hover {
  background-color: #f9fafb; /* Light gray background on hover */
  border-color: #d1d5db; /* Slightly darker border on hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Enhanced shadow on hover */
}

.time-slot-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #374151; /* Dark gray text */
}

.delete-icon {
  background: none;
  border: none;
  color: #ef4444;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}
.delete-icon:hover {
  /* No background color on hover */
  color: #dc2626; /* Optional: Darken the icon color on hover */
}
.time-slot-item:hover .delete-icon {
  opacity: 1;
}
.dark .time-slot-item {
  background-color: #1f2937; /* Dark gray background */
  border-color: #374151; /* Darker gray border */
  color: #f3f4f6; /* Light gray text */
}

.dark .time-slot-item:hover {
  background-color: #374151; /* Slightly lighter gray on hover */
  border-color: #4b5563; /* Lighter border on hover */
}

.dark .time-slot-content {
  color: #f3f4f6; /* Light gray text */
}

.dark .delete-icon {
  color: #ef4444; /* Red color for delete icon */
}

.dark .delete-icon:hover {
  color: #dc2626; /* Optional: Darken the icon color on hover */
}
</style>
