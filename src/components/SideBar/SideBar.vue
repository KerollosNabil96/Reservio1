<template>
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    @click="toggleSidebar"
  ></div>
  <nav
    :class="[
      sidebarOpen ? 'block' : 'hidden',
      'md:block w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg',
      'fixed md:relative inset-0 z-50 md:z-auto', // Add fixed positioning for mobile
    ]"
  >
    <!-- Header Section for Mobile -->
    <div class="p-4 md:hidden flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
        User Dashboard
      </h1>
      <button
        @click="closeSidebarOnMobile"
        class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <i class="fas fa-times"></i> 
      </button>
    </div>

    <!-- Header Section for Desktop -->
    <div class="p-6 hidden md:block">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
        Reservio
      </h1>
    </div>

    <!-- Menu Items -->
    <ul class="space-y-2 p-4">
      <li>
        <RouterLink
          to="/profile/bookings"
          class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
          :class="{
            'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
              $route.path === '/profile/bookings',
          }"
          @click="closeSidebarOnMobile"
        >
          <i class="fas fa-building mr-3"></i>
          Bookings
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/profile/user-venues"
          class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
          :class="{
            'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
              $route.path === '/profile/user-venues',
          }"
          @click="closeSidebarOnMobile"
        >
          <i class="fas fa-calendar mr-3"></i>
          Your Venues
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/profile/wallet"
          class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
          :class="{
            'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
              $route.path === '/profile/wallet',
          }"
          @click="closeSidebarOnMobile"
        >
          <i class="fas fa-wallet mr-3"></i>
          Your Wallet
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/settings"
          class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
          :class="{
            'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
              $route.path === '/settings',
          }"
          @click="closeSidebarOnMobile"
        >
          <i class="fas fa-cog mr-3"></i>
          Settings
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "SideBar",
  props: {
    sidebarOpen: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const closeSidebarOnMobile = () => {
      if (window.innerWidth < 768) {
        emit("toggle-sidebar", false);
      }
    };

    onMounted(() => {
      window.addEventListener("resize", closeSidebarOnMobile);
    });

    return {
      closeSidebarOnMobile,
    };
  },
};
</script>

<style scoped>
button {
  font-size: 1.5rem;
  transition: color 0.2s ease-in-out;
}
</style>