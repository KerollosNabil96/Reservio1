<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Mobile Menu Toggle Button -->
    <div
      class="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md"
    >
      <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
        User Dashboard
      </h1>
      <button
        @click="toggleSidebar"
        class="text-gray-700 dark:text-gray-300 focus:outline-none"
      >
        <i class="fas fa-bars text-xl"></i>
      </button>
    </div>

    <!-- Side Navigation -->
    <SideBar :sidebarOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Main Content -->
    <div
      :class="[
        'flex-1 p-4 md:p-8 overflow-auto dark:bg-gray-900',
        sidebarOpen ? 'pt-16 md:pt-0' : '', // Add padding-top when sidebar is open on mobile
      ]"
    >
      <!-- Header Section -->
      <div class="header-section mb-6">
        <h2 class="text-2xl md:text-3xl font-bold dark:text-white">
          Hello,
          <span :style="{ color: 'rgb(18, 102, 212)' }">{{ username }}</span>
        </h2>
        <p class="text-gray-600 dark:text-gray-400">Have a nice day!</p>
      </div>

      <!-- Bookings Section -->
      <div v-if="$route.path === '/profile/bookings'">
        <div class="search-section mb-6">
          <div class="search-box">
            <input
              type="search"
              v-model="searchQuery"
              placeholder="Search"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            v-model="sortOption"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All</option>
            <option value="nearest">Nearest Date</option>
            <option value="farthest">Farthest Date</option>
          </select>
        </div>

        <div class="dashboard">
          <h1 class="text-2xl font-bold text-green-600 mb-6">Booking List</h1>

          <div v-if="sortedBookings.length === 0" class="no-bookings">
            <p class="text-gray-600 dark:text-gray-400">
              No Bookings To Display
            </p>
          </div>

          <div
            v-else
            class="bookings-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="booking in sortedBookings"
              :key="booking.id"
              class="booking-card bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col"
            >
              <div class="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  v-if="
                    booking.venue.pictures && booking.venue.pictures.length > 0
                  "
                  :src="booking.venue.pictures[0]"
                  alt="Booking Image"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <i class="fas fa-image text-4xl"></i>
                </div>
              </div>

              <h3
                class="text-xl font-bold text-green-600 dark:text-green-400 mb-2 truncate"
              >
                {{ booking.venue.venueName }}
              </h3>

              <div
                class="flex items-center text-gray-600 dark:text-gray-400 mb-2"
              >
                <i class="fas fa-calendar-alt mr-2"></i>
                <span>{{ formatDate(booking.date) }}</span>
              </div>

              <div
                class="flex items-center text-gray-600 dark:text-gray-400 mb-4"
              >
                <i class="fas fa-map-marker-alt mr-2"></i>
                <span>
                  {{ booking.venue.address.city }},
                  {{ booking.venue.address.governorate }}
                </span>
              </div>

              <div class="mt-auto flex justify-between items-center">
                <span
                  class="text-lg font-semibold text-green-600 dark:text-green-400"
                >
                  {{ booking.venue.price }} EGP/hour
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Router View for Nested Routes -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { ref as firebaseRef, onValue } from "firebase/database";
import SideBar from "../SideBar/SideBar.vue";
import { getAuth } from "firebase/auth";

export default {
  name: "DashboardView",
  components: {
    SideBar,
  },
  data() {
    return {
      bookings: [],
      searchQuery: "",
      sortOption: "all",
      sidebarOpen: true,
      userId: null,
    };
  },
  computed: {
    username() {
      return this.$store?.state?.user?.name || "Guest";
    },
    filteredBookings() {
      return this.bookings.filter((booking) => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          booking.venue.venueName.toLowerCase().includes(searchLower) ||
          booking.venue.address.city.toLowerCase().includes(searchLower) ||
          booking.venue.address.governorate.toLowerCase().includes(searchLower)
        );
      });
    },
    sortedBookings() {
      let sorted = [...this.filteredBookings];

      if (this.sortOption === "nearest") {
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (this.sortOption === "farthest") {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      return sorted;
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    setupBookingsListener() {
      const auth = getAuth();
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.userId = user.uid;
          const bookingsRef = firebaseRef(db, "bookings");
          onValue(bookingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              this.bookings = Object.keys(data)
                .map((key) => ({ id: key, ...data[key] }))
                .filter((booking) => booking.userId === this.userId);
            } else {
              this.bookings = [];
            }
          });
        } else {
          this.bookings = [];
        }
      });
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
  mounted() {
    this.setupBookingsListener();
  },
};
</script>

<style scoped>
/* Custom styles for booking card */
.booking-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-5px);
}

.booking-image {
  transition: transform 0.3s ease;
}

.booking-card:hover .booking-image {
  transform: scale(1.05);
}
</style>
