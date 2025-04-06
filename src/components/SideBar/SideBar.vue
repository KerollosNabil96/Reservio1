<template>
  <!-- Mobile Menu Toggle Button -->
  <div
    class="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md"
  >
    <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
      {{ $t("sideBar.mobileTitle") }}
    </h1>
    <button
      @click="toggleSidebar"
      class="cursor-pointer text-gray-700 dark:text-gray-300 focus:outline-none"
    >
      <i class="fas fa-bars text-xl"></i>
    </button>
  </div>

  <!-- Sidebar.... Navigation -->
  <nav
    :class="[
      sidebarOpen ? 'block' : 'hidden',
      'md:block w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg',
    ]"
  >
    <!-- Header Section for Desktop -->
    <div class="p-6 hidden md:block">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
        {{ $t("sideBar.desktopTitle") }}
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
          <i
            class="fas fa-building mr-3"
            :class="[$i18n.locale === 'ar' ? 'ml-3' : 'mr-3']"
          ></i>
          {{ $t("sideBar.bookingsLink") }}
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
          <i
            class="fas fa-calendar mr-3"
            :class="[$i18n.locale === 'ar' ? 'ml-3' : 'mr-3']"
          ></i>
          {{ $t("sideBar.userVenuesLink") }}
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
          <i
            class="fas fa-wallet mr-3"
            :class="[$i18n.locale === 'ar' ? 'ml-3' : 'mr-3']"
          ></i>
          {{ $t("sideBar.walletLink") }}
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
          <i
            class="fas fa-cog mr-3"
            :class="[$i18n.locale === 'ar' ? 'ml-3' : 'mr-3']"
          ></i>
          {{ $t("sideBar.settingsLink") }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "SideBar",
  props: {
    sidebarOpen: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const toggleSidebar = () => {
      emit("toggle-sidebar", !props.sidebarOpen);
    };

    const closeSidebarOnMobile = () => {
      if (window.innerWidth < 768) {
        emit("toggle-sidebar", false);
      }
    };

    onMounted(() => {
      window.addEventListener("resize", closeSidebarOnMobile);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", closeSidebarOnMobile);
    });

    return {
      toggleSidebar,
      closeSidebarOnMobile,
    };
  },
};
</script>

<style scoped>
/* Sidebar styles */
nav {
  width: 100%;
  max-width: 300px;
}

@media (max-width: 767px) {
  nav {
    width: 100%;
    max-width: 100%;
  }

  ul {
    display: flex;
    justify-content: space-around;
    padding: 0.5rem 1rem;
    background-color: var(--tw-bg-opacity, 1) var(--tw-bg-color, #ffffff);
    border-top: 1px solid var(--tw-border-opacity, 1)
      var(--tw-border-color, #e5e7eb);
  }

  li {
    flex: 1;
    text-align: center;
  }

  li a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
  }

  li i {
    margin-bottom: 0.25rem;
  }
}
</style>
