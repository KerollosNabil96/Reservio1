<template>
  <div class="dashboard-container">
    <!-- زر لإظهار الـ Sidebar إذا كان مغلق -->
    <button v-if="!isSidebarOpen" class="show-sidebar-btn" @click="showSidebar">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar ثابت مع التبديل عبر Button -->
    <SideBar ref="sidebar" @sidebar-toggle="handleSidebarToggle" />

    <div class="main-content" :class="{ 'content-expanded': !isSidebarOpen }">
      <!-- Header Section -->
      <div class="header-section">
        <h2 class="font-bold text-3xl dark:text-white">Hello, {{username}}</h2>
        <p class="subtitle">Have a nice day</p>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SideBar from "../SideBar/SideBar.vue";

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

  computed: {
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
</style>
