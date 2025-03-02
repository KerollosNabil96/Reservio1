<template>
  <nav
    class="flex items-center justify-between py-4 px-6 md:px-16 bg-white shadow-sm dark:bg-gray-700 dark:text-white"
  >
    <!-- Brand / Logo -->
    <RouterLink to="/" class="text-2xl font-bold text-blue-600"
      >Reservio</RouterLink
    >

    <!-- Navigation Links -->
    <ul class="hidden md:flex items-center space-x-6">
      <li>
        <RouterLink to="/" class="hover:text-blue-600">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/about" class="hover:text-blue-600">About</RouterLink>
      </li>
      <li>
        <a href="#contact-form" class="hover:text-blue-600">Contact</a>
      </li>
      <li>
        <button class="hover:cursor-pointer" @click="toggleDarkMode">
          Dark
        </button>
      </li>
    </ul>

    <!-- Auth Buttons -->
    <div class="flex items-center space-x-4">
      <RouterLink
        to="/signin"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Sign In
      </RouterLink>
      <RouterLink
        to="/signup"
        class="text-blue-600 hover:text-blue-800 border-1 border-blue-600 px-4 py-2 rounded-md transition-colors"
      >
        Sign Up
      </RouterLink>
    </div>
  </nav>
</template>

<script>
import store from "@/store/store";

export default {
  methods: {
    toggleDarkMode() {
      store.state.isDarkMode = !store.state.isDarkMode;
    },
  },
  computed: {
    dark() {
      return store.state.isDarkMode;
    },
  },
};
</script>
