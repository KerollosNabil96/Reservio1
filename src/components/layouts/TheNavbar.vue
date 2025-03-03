<template>
  <nav class="bg-white shadow-sm dark:bg-gray-900 dark:text-white relative">
    <div
      class="flex items-center justify-between py-4 px-6 md:px-16 w-11/12 mx-auto"
    >
      <!-- Logo -->
      <RouterLink to="/" class="text-2xl font-bold text-blue-600">
        Reservio
      </RouterLink>

      <!-- Hamburger Icon (visible on mobile, hidden on md and up) -->

      <div class="md:hidden text-gray-800 dark:text-white" @click="toggleMenu">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <!-- Hamburger lines (shown when menu is closed) -->
          <path v-if="!isMenuOpen" d="M4 6h16M4 12h16M4 18h16" />
          <!-- "X" icon (shown when menu is open) -->
          <path v-else d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <!-- Navigation Links (desktop) -->
      <ul class="hidden md:flex items-center space-x-6">
        <li>
          <RouterLink
            to="/"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/' }"
            >Home</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/register-venue"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/register-venue' }"
            >Share Venue</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/book-now"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/book-now' }"
            >Book Now</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/about"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/about' }"
            >About</RouterLink
          >
        </li>
        <li>
          <a href="#footer" class="hover:text-blue-600">Contact</a>
        </li>
        <li>
          <RouterLink
            to="/FAQs"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/FAQs' }"
            >FAQs</RouterLink
          >
        </li>
        <li>
          <button class="hover:cursor-pointer" @click="toggleDarkMode">
            Dark
          </button>
        </li>
      </ul>

      <!-- Auth Buttons (desktop) -->
      <div class="hidden md:flex items-center space-x-4">
        <BaseButton
          @click="showSigninForm = true"
          class="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
        >
          Sign In
        </BaseButton>
        <BaseButton
          @click="showSignupForm = true"
          class="text-blue-600 hover:text-blue-800 border-1 border-blue-600 px-4 py-2"
        >
          Sign Up
        </BaseButton>
      </div>

      <!-- Mobile Menu (shown when isMenuOpen = true) -->
      <transition name="fade">
        <div
          v-if="isMenuOpen"
          class="absolute top-16 left-0 w-full bg-white shadow-md p-4 md:hidden dark:bg-gray-700 dark:text-white"
        >
          <!-- Mobile Nav Links -->
          <ul class="flex flex-col space-y-4 mb-4">
            <li>
              <RouterLink to="/" class="hover:text-blue-600" @click="closeMenu"
                >Home</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/register-venue"
                class="hover:text-blue-600"
                @click="closeMenu"
                >Share Venue</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/" class="hover:text-blue-600" @click="closeMenu"
                >Book Now</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/about"
                class="hover:text-blue-600"
                @click="closeMenu"
                >About</RouterLink
              >
            </li>
            <li>
              <a
                href="#contact-form"
                class="hover:text-blue-600"
                @click="closeMenu"
                >Contact</a
              >
            </li>
            <li>
              <RouterLink
                to="/about"
                class="hover:text-blue-600"
                @click="closeMenu"
                >FAQs</RouterLink
              >
            </li>
            <li>
              <button class="hover:cursor-pointer" @click="toggleDarkMode">
                Dark
              </button>
            </li>
          </ul>

          <!-- Mobile Auth Buttons -->
          <div class="flex items-center space-x-4">
            <BaseButton
              @click="
                closeMenu;
                showSigninForm = true;
              "
              class="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              Sign In
            </BaseButton>
            <BaseButton
              @click="
                closeMenu;
                showSignupForm = true;
              "
              class="text-blue-600 hover:text-blue-800 border-1 border-blue-600 px-4 py-2"
            >
              Sign Up
            </BaseButton>
          </div>
        </div>
      </transition>
    </div>
  </nav>

  <!-- Signup Form Popup -->
  <Signup
    :show="showSignupForm"
    @close="showSignupForm = false"
    @switch-to-signin="
      showSignupForm = false;
      showSigninForm = true;
    "
  />

  <!-- Signin Form Popup -->
  <Signin
    :show="showSigninForm"
    @close="showSigninForm = false"
    @switch-to-signup="
      showSigninForm = false;
      showSignupForm = true;
    "
  />
</template>

<script>
import store from "@/store/store";
import Signup from "../registration/Signup.vue";
import Signin from "../registration/Signin.vue";

export default {
  components: {
    Signup,
    Signin,
  },
  data() {
    return {
      isMenuOpen: false,
      showSignupForm: false,
      showSigninForm: false,
    };
  },
  methods: {
    toggleDarkMode() {
      store.state.isDarkMode = !store.state.isDarkMode;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
  },
  computed: {
    dark() {
      return store.state.isDarkMode;
    },
    selected() {
      return "text-blue-600";
    },
  },
};
</script>

<style scoped>
/* Simple fade transition for the mobile menu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
