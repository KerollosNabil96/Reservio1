<template>
  <div class="dashboard-container">
    <button v-if="!isSidebarOpen" class="show-sidebar-btn" @click="showSidebar">
      <i class="fas fa-bars"></i>
    </button>

    <SideBar ref="sidebar" @sidebar-toggle="handleSidebarToggle" />
    <div class="main-content" :class="{ 'content-expanded': !isSidebarOpen }">
      <div class="header-section">
        <h2>Hello, <span :style="{ color: 'rgb(18, 102, 212)'}">{{ username }}</span></h2>
        <p class="subtitle">Have a nice day</p>
      </div>

      <div class="search-section">
        <div class="search-box">
          <input type="search" v-model="searchQuery" placeholder="Search" />
        </div>
        <select class="filter-select" v-model="sortOption">
          <option value="all">All</option>
          <option value="nearest">Nearest Date</option>
          <option value="farthest">Farthest Date</option>
        </select>
      </div>

      <div class="dashboard">
        <h1>Booking List</h1>

        <div v-if="sortedBookings.length === 0" class="no-bookings">
          <p>No Bookings To Display</p>
        </div>

        <div v-else class="bookings-list">
          <div v-for="booking in sortedBookings" :key="booking.id" class="booking-card">
            <img
              v-if="booking.venue.pictures && booking.venue.pictures.length > 0"
              :src="booking.venue.pictures[0]"
              alt="Booking Image"
              class="booking-image"
            />
            <h3>{{ booking.venue.venueName }}</h3>
            <p>Date: {{ formatDate(booking.date) }}</p>
            <p>Address: {{ booking.venue.address.city }}, {{ booking.venue.address.governorate }}</p>
            <p class="price">{{ booking.venue.price }} EGP/hour</p>
          </div>
        </div>
      </div>
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
      isSidebarOpen: true,
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
    showSidebar() {
      this.isSidebarOpen = true;
      this.$refs.sidebar.isOpen = true;
    },
    handleSidebarToggle(isOpen) {
      this.isSidebarOpen = isOpen;
    },
  },
  mounted() {
    this.setupBookingsListener();
  },
};
</script>


<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
}

.content-expanded {
  margin-left: 0;
}

.show-sidebar-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: #1976d2;
  color: white;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.show-sidebar-btn:hover {
  background: #1565c0;
}

.header-section {
  margin-bottom: 2rem;
}

.subtitle {
  color: #666;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box input {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 100%;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 100%;
}

.dashboard {
  padding: 20px;
}

.bookings-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.booking-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.booking-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
}

h1 {
  color: green;
  font-size: 25px;
  font-weight: 500;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h3 {
  color: green;
  margin: 0 0 10px 0;
}

.price {
  color: green;
  margin-top: 0.5rem;
}

.no-bookings {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .search-section {
    flex-direction: column;
  }

  .bookings-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .booking-card {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .bookings-list {
    grid-template-columns: 1fr;
  }

  .search-box input,
  .filter-select {
    width: 100%;
  }
}
</style>