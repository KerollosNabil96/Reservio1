<template>
  <div class="dashboard-container">
    <button v-if="!isSidebarOpen" class="show-sidebar-btn" @click="showSidebar">
      <i class="fas fa-bars"></i>
    </button>

    <SideBar ref="sidebar" @sidebar-toggle="handleSidebarToggle" />
    <div class="main-content" :class="{ 'content-expanded': !isSidebarOpen }">
      <!-- Header Section -->
      <div class="header-section">
        <h2>Hello, {{username}}</h2>
        <p class="subtitle">Have a nice day</p>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="search-box">
          <input type="search" placeholder="Search" />
        </div>
        <select class="filter-select">
          <option value="all">All</option>
        </select>
      </div>

      <!-- Booking List -->
      <div class="booking-section">
        <div class="booking-header">
          <h3>Booking List</h3>
          <span class="sort-by">Sort by</span>
        </div>

        <div class="booking-cards">
          <div class="booking-card">
            <img src="@/assets/stadium.jpg" alt="Stadium" class="card-image" />
            <div class="card-content">
              <div class="card-header">
                <h4>Liverpool Sports Stadium</h4>
                <button class="info-button">
                  <i class="fas fa-info-circle"></i>
                </button>
              </div>
              <p>20 Jan - 22 Jan</p>
              <p>02 Days</p>
              <p>Nasr City, Cairo</p>
              <p class="price">Total Payment: 200 EGP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../SideBar/SideBar.vue";
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "DashboardView",
  components: {
    SideBar,
  },
  data() {
    return {
      isSidebarOpen: true,
    };
  },

  computed:{
    username() {
      return this.$store.state.user?.name || "Guest";
    },
  },
  methods: {
    showSidebar() {
      this.isSidebarOpen = true;
      this.$refs.sidebar.isOpen = true;
    },
    handleSidebarToggle(isOpen) {
      this.isSidebarOpen = isOpen;
    },
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
  justify-content: space-between;
  margin-bottom: 2rem;
}

.search-box input {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 300px;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.booking-card {
  max-width: 345px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.price {
  color: #1976d2;
  margin-top: 0.5rem;
}
</style>
