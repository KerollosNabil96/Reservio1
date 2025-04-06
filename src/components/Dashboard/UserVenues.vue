<template>
  <div class="main-content">
    <div class="booking-section">
      <div class="search-section mb-6 flex flex-col sm:flex-row gap-2">
        <div class="search-box w-full sm:w-11/12">
          <input
            type="search"
            v-model="searchQuery"
            :placeholder="$t('userVenues.searchPlaceholder')"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          v-model="sortOption"
          class="w-full sm:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="all" disabled>{{ $t("userVenues.sortAll") }}</option>
          <option value="nearest">{{ $t("userVenues.sortNearest") }}</option>
          <option value="farthest">{{ $t("userVenues.sortFarthest") }}</option>
        </select>
      </div>
      <div class="booking-header text-xl md:text-2xl font-bold dark:text-white">
        <h1 class="text-2xl font-bold text-green-600 mb-6">
          {{ $t("userVenues.title") }}
        </h1>
      </div>
    </div>

    <div v-if="sortedBookings.length === 0" class="no-bookings">
      <p>{{ $t("userVenues.noVenues") }}</p>
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
              {{ venue.price }} {{ $t("egp") }}/ {{ perWhat }}
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
                  : $t("venueCard.noRatings")
              }}
              <span v-if="venue.totalReviews > 0" class="ml-1"
                >({{ venue.totalReviews }}
                {{
                  venue.totalReviews === 1
                    ? $t("userVenues.review")
                    : $t("userVenues.reviews")
                }})</span
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
                  class="cursor-pointer delete-icon"
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
            class="cursor-pointer mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {{ $t("userVenues.showBookingsBtn") }}
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
        {{ $t("dashboardView.paginationPrevious") }}
      </button>
      <span class="text-gray-700 dark:text-gray-300">{{
        $t("dashboardView.paginationPageInfo", {
          currentPage: currentPage,
          totalPages: totalPages,
        })
      }}</span>
      <button
        @click="nextPageAndScroll"
        :disabled="currentPage === totalPages"
        class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        {{ $t("dashboardView.paginationNext") }}
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
          {{ $t("userVenues.deleteModalTitle") }}
        </h3>
        <button
          @click="closeDeleteModal"
          class="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        {{ $t("userVenues.deleteModalConfirm") }}
      </p>
      <div class="flex justify-end gap-4">
        <button
          @click="closeDeleteModal"
          class="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          :disabled="loading"
        >
          {{ $t("userVenues.cancelBtn") }}
        </button>
        <button
          @click="confirmDelete"
          class="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
          :disabled="loading"
        >
          <span v-if="loading" class="loader mr-2"></span>
          <span>{{ $t("userVenues.deleteBtn") }}</span>
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
          {{ $t("userVenues.userBookingsModalTitle") }}
        </h3>
        <button
          @click="showBooking = false"
          class="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                <p>
                  <strong>{{ $t("userVenues.bookingUserLabel") }}:</strong>
                  {{ booking.username }}
                </p>
                <p>
                  <strong>{{ $t("userVenues.bookingDateLabel") }}:</strong>
                  {{ booking.date }}
                </p>
                <p>
                  <strong>{{ $t("userVenues.bookingMethodLabel") }}:</strong>
                  {{ booking.method }}
                </p>
              </div>
              <button
                @click="showUserDetails(booking.userId)"
                class="cursor-pointer ml-2 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                {{ $t("userVenues.detailsBtn") }}
              </button>
            </div>
            <hr class="my-3" />
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-gray-600 dark:text-gray-300">
          {{ $t("userVenues.noBookingsForVenue") }}
        </p>
      </div>

      <!-- Close Button -->
      <div class="flex justify-end mt-6">
        <button
          @click="showBooking = false"
          class="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          {{ $t("close") }}
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
          {{ $t("userVenues.userDetailsModalTitle") }}
        </h3>
        <button
          @click="showUserModal = false"
          class="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
            <strong>{{ $t("userVenues.userDetailsNameLabel") }}:</strong>
            {{ user.name }}
          </p>
          <p class="text-gray-600 dark:text-gray-300 mb-2">
            <strong>{{ $t("userVenues.userDetailsEmailLabel") }}:</strong>
            {{ user.email }}
          </p>
          <p class="text-gray-600 dark:text-gray-300 mb-2">
            <strong>{{ $t("userVenues.userDetailsPhoneLabel") }}:</strong>
            {{ user.phone }}
          </p>
          <!-- Add more user details as needed -->
        </div>
      </div>
      <!-- Close Button -->
      <div class="flex justify-end mt-6">
        <button
          @click="showUserModal = false"
          class="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          {{ $t("close") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import VenueCard from "../reservations/VenueCard.vue";
import store from "@/store/store";
import {
  getDatabase,
  ref as dbRef,
  get,
  set,
  remove,
  onValue,
  push,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      searchQuery: "",
      sortOption: "all",
      venues: [],
      loading: false,
      showDeleteModal: false,
      selectedVenueId: null,
      selectedTimeSlotId: null,
      userBookings: [],
      allUsers: [],
      showBooking: false,
      filteredBookings: [],
      showUserModal: false,
      filteredUsers: [],
      currentPage: 1,
      itemsPerPage: 6,
      perWhat: "Hour",
      venueTimeslots: {},
    };
  },
  computed: {
    userId() {
      return store.state.user?.id;
    },
    sortedBookings() {
      let sorted = [...this.venues];
      if (this.searchQuery) {
        sorted = sorted.filter((venue) =>
          venue.venueName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      if (this.sortOption === "nearest") {
        sorted.sort((a, b) => {
          const dateA = a.selectedDate ? new Date(a.selectedDate) : new Date(0);
          const dateB = b.selectedDate ? new Date(b.selectedDate) : new Date(0);
          return dateA - dateB;
        });
      } else if (this.sortOption === "farthest") {
        sorted.sort((a, b) => {
          const dateA = a.selectedDate ? new Date(a.selectedDate) : new Date(0);
          const dateB = b.selectedDate ? new Date(b.selectedDate) : new Date(0);
          return dateB - dateA;
        });
      }
      return sorted.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    },
    totalPages() {
      let filtered = [...this.venues];
      if (this.searchQuery) {
        filtered = filtered.filter((venue) =>
          venue.venueName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return Math.ceil(filtered.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchOwnerVenues() {
      if (!this.userId) return;
      this.loading = true;
      const db = getDatabase();
      const venuesRef = dbRef(db, "venues");

      try {
        const snapshot = await get(venuesRef);
        if (snapshot.exists()) {
          const allVenues = snapshot.val();
          this.venues = Object.entries(allVenues)
            .filter(([id, venue]) => venue.ownerId === this.userId)
            .map(([id, venue]) => ({ ...venue, id }));
          this.venues.forEach((venue) => {
            this.fetchVenueTimeSlots(venue.id);
          });
        } else {
          this.venues = [];
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
        this.venues = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchVenueTimeSlots(venueId) {
      if (!venueId) return;
      const db = getDatabase();
      const slotsRef = dbRef(db, `venues/${venueId}/timeSlots`);
      try {
        const snapshot = await get(slotsRef);
        if (snapshot.exists()) {
          this.venueTimeslots[venueId] = snapshot.val();
        } else {
          this.venueTimeslots[venueId] = {};
        }
      } catch (error) {
        console.error(`Error fetching timeslots for venue ${venueId}:`, error);
        this.venueTimeslots[venueId] = {};
      }
    },
    filteredTimeSlots(venueId) {
      return Object.entries(this.venueTimeslots[venueId] || {});
    },
    openDeleteModal(venueId, timeslotId) {
      this.selectedVenueId = venueId;
      this.selectedTimeSlotId = timeslotId;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedVenueId = null;
      this.selectedTimeSlotId = null;
    },
    async confirmDelete() {
      if (!this.selectedVenueId || !this.selectedTimeSlotId) return;
      this.loading = true;
      const db = getDatabase();
      const venueId = this.selectedVenueId;
      const timeslotId = this.selectedTimeSlotId;

      try {
        const timeSlotRef = dbRef(
          db,
          `venues/${venueId}/timeSlots/${timeslotId}`
        );
        const timeSlotSnapshot = await get(timeSlotRef);
        if (!timeSlotSnapshot.exists()) {
          throw new Error(this.t("userVenues.timeSlotNotFound"));
        }
        const timeslotData = timeSlotSnapshot.val();
        const venueRef = dbRef(db, `venues/${venueId}`);
        const venueSnapshot = await get(venueRef);
        if (!venueSnapshot.exists()) {
          throw new Error(this.t("userVenues.venueNotFound"));
        }
        const venueData = venueSnapshot.val();

        const bookingsRef = dbRef(db, "bookings");
        const bookingsSnapshot = await get(bookingsRef);
        const relevantBookings = [];
        if (bookingsSnapshot.exists()) {
          const allBookingsData = bookingsSnapshot.val();
          Object.entries(allBookingsData).forEach(([bookingId, booking]) => {
            if (
              booking.venue.id === venueId &&
              booking.timeSlotId === timeslotId
            ) {
              relevantBookings.push({ id: bookingId, ...booking });
            }
          });
        }

        let totalRefundAmount = 0;
        const refundPromises = relevantBookings.map(async (booking) => {
          const refundAmount = booking.venue.price * 0.8;
          totalRefundAmount += refundAmount;
          const userBalanceRef = dbRef(db, `users/${booking.userId}/balance`);
          const userBalanceSnapshot = await get(userBalanceRef);
          const currentBalance = userBalanceSnapshot.exists()
            ? userBalanceSnapshot.val()
            : 0;
          const userBookingRef = dbRef(
            db,
            `users/${booking.userId}/bookings/${booking.id}`
          );
          const globalBookingRef = dbRef(db, `bookings/${booking.id}`);

          const notificationsListRef = dbRef(
            db,
            `users/${booking.userId}/notifications`
          );
          const newNotificationRef = push(notificationsListRef);

          return Promise.all([
            set(userBalanceRef, currentBalance + refundAmount),
            remove(userBookingRef),
            remove(globalBookingRef),
            set(newNotificationRef, {
              id: newNotificationRef.key,
              message: this.t("userVenues.notificationCancelRefund", {
                venueName: venueData.venueName,
                date: booking.date,
              }),
              read: false,
              timestamp: Date.now(),
            }),
          ]);
        });

        await Promise.all(refundPromises);

        if (totalRefundAmount > 0) {
          const ownerBalanceRef = dbRef(db, `users/${this.userId}/balance`);
          const ownerBalanceSnapshot = await get(ownerBalanceRef);
          const ownerCurrentBalance = ownerBalanceSnapshot.exists()
            ? ownerBalanceSnapshot.val()
            : 0;
          const newOwnerBalance = ownerCurrentBalance - totalRefundAmount;
          if (newOwnerBalance < 0) {
            console.warn(
              "Owner balance negative after refund deduction. Setting to 0."
            );
            await set(ownerBalanceRef, 0);
          } else {
            await set(ownerBalanceRef, newOwnerBalance);
          }
        }

        await remove(timeSlotRef);

        delete this.venueTimeslots[venueId][timeslotId];
        this.venueTimeslots = { ...this.venueTimeslots };
      } catch (error) {
        console.error(
          "Error deleting time slot and processing refunds:",
          error
        );
        let displayError = this.t("userVenues.deleteError");
        if (error.message === this.t("userVenues.timeSlotNotFound")) {
          displayError = error.message;
        } else if (error.message === this.t("userVenues.venueNotFound")) {
          displayError = error.message;
        } else if (error.message.includes("deducting owner")) {
          displayError = this.t("userVenues.deductBalanceError");
        }
      } finally {
        this.loading = false;
        this.closeDeleteModal();
      }
    },
    async fetchAllBookings() {
      if (!this.userId) return;
      const db = getDatabase();
      const bookingsRef = dbRef(db, "bookings");
      try {
        onValue(bookingsRef, (snapshot) => {
          if (snapshot.exists()) {
            const allBookingsData = snapshot.val();
            this.userBookings = Object.values(allBookingsData).filter(
              (booking) => {
                return this.venues.some(
                  (venue) => venue.id === booking.venue.id
                );
              }
            );
          } else {
            this.userBookings = [];
          }
        });
      } catch (error) {
        console.error("Error fetching all bookings:", error);
      }
    },
    async fetchAllUsers() {
      const db = getDatabase();
      const usersRef = dbRef(db, "users");
      try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          this.allUsers = Object.entries(snapshot.val()).map(([id, user]) => ({
            ...user,
            id,
          }));
        } else {
          this.allUsers = [];
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    showBookings(venueId) {
      this.filteredBookings = this.userBookings.filter(
        (booking) => booking.venue.id === venueId
      );
      this.showBooking = true;
    },
    showUserDetails(userId) {
      this.filteredUsers = this.allUsers.filter((user) => user.id === userId);
      this.showUserModal = true;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
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
  mounted() {
    // Rely on the centralized auth state from Vuex, populated by main.js
    // Fetch data directly if userId is available
    if (this.userId) {
      this.fetchOwnerVenues();
      this.fetchAllBookings();
      this.fetchAllUsers();
    } else {
      // Optional: Watch for userId if it might not be ready immediately
      // This might be needed if navigation happens extremely fast
      const unwatch = this.$watch("userId", (newUserId) => {
        if (newUserId) {
          this.fetchOwnerVenues();
          this.fetchAllBookings();
          this.fetchAllUsers();
          unwatch(); // Stop watching once userId is available
        }
      });
    }
  },
};
</script>
<style scoped>
.main-content {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.dark .main-content {
  background-color: #1a202c;
}

.no-bookings {
  text-align: center;
  margin-top: 50px;
  color: #888;
  font-size: 1.2em;
}

.dark .no-bookings {
  color: #aaa;
}

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

.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.time-slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-slot-item {
  background-color: #e2e8f0;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.875rem;
}

.dark .time-slot-item {
  background-color: #4a5568;
}

.time-slot-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-icon {
  color: #ef4444;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 1;
  font-size: 0.75rem;
}

.dark .delete-icon {
  color: #f87171;
}

.delete-icon:hover {
  color: #dc2626;
}

.dark .delete-icon:hover {
  color: #ef4444;
}
</style>
