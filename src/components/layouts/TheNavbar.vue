<template>
  <nav
    class="bg-white shadow-sm dark:bg-gray-900 dark:text-white fixed top-0 left-0 right-0 z-50"
  >
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
        <!-- Show these buttons when user is NOT authenticated -->
        <template v-if="!isAuthenticated">
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
        </template>

        <!-- Show user dropdown when authenticated -->
        <template v-else>
          <div class="relative">
            <div
              @click="toggleUserMenu"
              class="flex items-center space-x-2 cursor-pointer py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>{{ userEmail }}</span>
              <svg
                class="w-4 h-4"
                :class="{ 'transform rotate-180': isUserMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <!-- Dropdown Menu -->
            <transition name="fade">
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 dark:bg-gray-800"
              >
                <RouterLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </div>
                </RouterLink>
                <RouterLink
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </div>
                </RouterLink>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <div
                    class="flex items-center text-red-600 hover:cursor-pointer"
                  >
                    <svg
                      class="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log out
                  </div>
                </button>
              </div>
            </transition>
          </div>
        </template>
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
              <RouterLink
                to="/book-now"
                class="hover:text-blue-600"
                @click="closeMenu"
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
                to="/FAQs"
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
          <div class="flex flex-col space-y-4">
            <!-- Show these buttons when user is NOT authenticated -->
            <template v-if="!isAuthenticated">
              <BaseButton
                @click="
                  closeMenu;
                  showSigninForm = true;
                "
                class="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 w-full"
              >
                Sign In
              </BaseButton>
              <BaseButton
                @click="
                  closeMenu;
                  showSignupForm = true;
                "
                class="text-blue-600 hover:text-blue-800 border-1 border-blue-600 px-4 py-2 w-full"
              >
                Sign Up
              </BaseButton>
            </template>
            
            <!-- Show user profile options when authenticated -->
            <template v-else>
              <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div class="flex items-center mb-4 px-2">
                  <span class="font-medium">{{ userEmail }}</span>
                </div>
                
                <RouterLink
                  to="/profile"
                  class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                  @click="closeMenu"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </RouterLink>
                
                <RouterLink
                  to="/settings"
                  class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                  @click="closeMenu"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </RouterLink>
                
                <button
                  @click="handleLogout(); closeMenu();"
                  class="flex items-center w-full text-left px-2 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Log out
                </button>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </nav>

  <!-- Add a spacer to prevent content from being hidden under the navbar -->
  <div class="h-16"></div>

  <!-- Signup and Signin components -->
  <Signup
    :show="showSignupForm"
    @close="showSignupForm = false"
    @switch-to-signin="
      showSignupForm = false;
      showSigninForm = true;
    "
  />
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
import { logoutUser } from "@/firebase";

export default {
  data() {
    return {
      isMenuOpen: false,
      isUserMenuOpen: false,
      showSignupForm: false,
      showSigninForm: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    userEmail() {
      return this.$store.state.user ? this.$store.state.user.email : "";
    },
  },
  components: {
    Signup,
    Signin,
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
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    async handleLogout() {
      try {
        const { error } = await logoutUser();
        if (error) {
          console.error("Logout error:", error);
          return;
        }

        // Clear user data from store
        store.state.user = null;
        store.state.isAuthenticated = false;
        console.log("User logged out successfully");
      } catch (err) {
        console.error("Unexpected logout error:", err);
      }
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
