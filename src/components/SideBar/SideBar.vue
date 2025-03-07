<template>
  <div class="sidebar" :class="{ 'sidebar-closed': !isOpen }">
    <div class="logo">
      <h2>Reservio</h2>
    </div>
    <nav class="nav-menu">
      <!-- Check if the route starts with /profile to activate Bookings -->
      <router-link 
        to="/profile/bookings" 
        class="nav-item" 
        :class="{ active: $route.path === '/profile/bookings' }">
        <i class="fas fa-building"></i>
        <span>Bookings</span>
      </router-link>
      <router-link 
        to="/profile/user-venues" 
        class="nav-item" 
        :class="{ active: $route.path === '/profile/user-venues' }">
        <i class="fas fa-building"></i>
        <span>Your venues</span>
      </router-link>
      <router-link 
        to="/profile/wallet" 
        class="nav-item" 
        :class="{ active: $route.path === '/profile/wallet' }">
        <i class="fas fa-wallet"></i>
        <span>Your wallet</span>
      </router-link>
      <router-link 
        to="/settings" 
        class="nav-item" 
        :class="{ active: $route.path === '/settings' }">
        <i class="fas fa-cog"></i>
        <span>Setting</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  data() {
    return {
      isOpen: true
    }
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
      this.$emit('sidebar-toggle', this.isOpen);
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  position: fixed;
  transition: transform 0.3s ease;
}

.sidebar-closed {
  transform: translateX(-240px);
}

.logo {
  padding: 1.5rem;
  color: #1976d2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #e3f2fd;
}

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
}

.nav-item i {
  margin-right: 1rem;
}

.nav-item.active {
  background: #e3f2fd;
  color: #1976d2;
}

.nav-item:hover {
  background: #f5f5f5;
}

.nav-item.active {
  background: #e3f2fd;
  color: #1976d2;
}
</style>