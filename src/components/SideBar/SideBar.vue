<template>
  <div>
    <!-- Hamburger Menu Button for Mobile -->
    <button class="hamburger-menu" @click="toggleSidebar">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-closed': !isOpen }">
      <div class="logo">
        <!-- Logo or Brand Name -->
        <span>Reservio</span>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <router-link to="/bookings" class="nav-item" :class="{ active: $route.path === '/bookings' }">
          <i class="fas fa-calendar"></i>
          <span>Bookings</span>
        </router-link>
        <router-link to="/venues" class="nav-item" :class="{ active: $route.path === '/venues' }">
          <i class="fas fa-building"></i>
          <span>Your Venues</span>
        </router-link>
        <router-link to="/wallet" class="nav-item" :class="{ active: $route.path === '/wallet' }">
          <i class="fas fa-wallet"></i>
          <span>Your Wallet</span>
        </router-link>
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </router-link>
      </nav>
    </div>

    <!-- Overlay for Mobile -->
    <div v-if="!isOpen && isMobile" class="sidebar-overlay" @click="toggleSidebar"></div>
  </div>
</template>


<script>
export default {
  name: 'SideBar',
  data() {
    return {
      isOpen: false, // Sidebar is closed by default on mobile
      isMobile: false, // Track if the screen is mobile
    };
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
      this.$emit('sidebar-toggle', this.isOpen);
    },
    handleResize() {
      // Check if the screen is mobile
      this.isMobile = window.innerWidth < 768;
      // Automatically open the sidebar on larger screens
      if (!this.isMobile) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    },
  },
  mounted() {
    this.handleResize(); // Set initial state based on screen size
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>



<style scoped>
/* Sidebar Base Styles */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  background: white;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  transition: transform 0.3s ease;
  z-index: 100; /* Lower z-index than the footer */
  overflow-y: auto
}

.sidebar-closed {
  transform: translateX(-240px);
}

/* Logo Section */
.logo {
  padding: 1.5rem;
  color: #1976d2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo span {
  font-size: 1.25rem;
  font-weight: bold;
}

/* Navigation Menu */
.nav-menu {
  padding: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #666;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.nav-item i {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.nav-item.active {
  background: #e3f2fd;
  color: #1976d2;
}

.nav-item:hover {
  background: #f5f5f5;
}

/* Hamburger Menu Button for Mobile */
.hamburger-menu {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
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

.hamburger-menu:hover {
  background: #1565c0;
}

/* Overlay for Mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Responsive Styles */
@media (min-width: 768px) {
  .hamburger-menu {
    display: none; /* Hide hamburger menu on larger screens */
  }

  .sidebar-closed {
    transform: translateX(0); /* Always show sidebar on larger screens */
  }
}

@media (max-width: 767px) {
  .sidebar {
    transform: translateX(-240px); /* Hide sidebar by default on mobile */
  }

  .sidebar-closed {
    transform: translateX(-240px);
  }

  .sidebar-overlay {
    display: block; /* Show overlay when sidebar is open */
  }
}
</style>