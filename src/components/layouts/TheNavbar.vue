<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
      isScrolled
        ? 'bg-white/60 dark:bg-gray-900/70 backdrop-blur-md shadow-md'
        : 'bg-white dark:bg-gray-900 shadow-sm',
    ]"
  >
    <div
      class="flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 w-full sm:w-11/12 mx-auto text-gray-800 dark:text-white"
    >
      <!-- Logo -->
      <RouterLink
        to="/"
        class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400"
        >Reservio
      </RouterLink>

      <!-- Mobile Right Section (notification and hamburger) -->
      <div class="md:hidden flex items-center">
        <!-- Mobile Notification Icon -->
        <notification-dropdown
          v-if="isAuthenticated && !$store.state.user?.isAdmin"
          class="mr-2"
        />

        <!-- Hamburger Icon (visible on mobile, hidden on md and up) -->
        <div
          class="text-gray-800 dark:text-white p-2 cursor-pointer"
          @click="toggleMenu"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6"
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
      </div>

      <!-- Navigation Links (desktop) -->
      <ul
        class="hidden md:flex items-center space-x-2 md:space-x-4 lg:space-x-10 justify-between"
      >
        <li>
          <RouterLink
            to="/"
            class="nav-link hover:text-blue-600 text-base lg:text-md"
            :class="{ 'text-blue-600 active': $route.path === '/' }"
            >{{ $t("home") }}</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/book-now"
            class="nav-link hover:text-blue-600 text-base lg:text-md"
            :class="{
              'text-blue-600 active': $route.path.includes('/book-now'),
            }"
            >{{ $t("book_now") }}</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/register-venue"
            class="nav-link hover:text-blue-600 text-base lg:text-md"
            :class="{
              'text-blue-600 active': $route.path === '/register-venue',
            }"
            >{{ $t("share_venue") }}</RouterLink
          >
        </li>

        <li>
          <RouterLink
            to="/about"
            class="nav-link hover:text-blue-600 text-base lg:text-md"
            :class="{ 'text-blue-600 active': $route.path === '/about' }"
            >{{ $t("about") }}</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/contact"
            class="nav-link hover:text-blue-600 text-base lg:text-md"
            :class="{ 'text-blue-600 active': $route.path === '/contact' }"
            >{{ $t("contact") }}</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/FAQs"
            class="nav-link hover:text-blue-600 text-base lg:text-md"
            :class="{ 'text-blue-600 active': $route.path === '/FAQs' }"
            >{{ $t("faqs") }}</RouterLink
          >
        </li>
      </ul>

      <!-- Auth Buttons (desktop) -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Language Toggle (moved after navigation links) -->
        <button
          class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
          @click="toggleLanguage"
        >
          <span
            class="px-3 py-1.5 transition-colors duration-300"
            :class="{
              'bg-blue-600 text-white': currentLanguage === 'en',
              'text-gray-600 dark:text-gray-300 hover:text-blue-600 cursor-pointer':
                currentLanguage === 'ar',
            }"
            >EN</span
          >
          <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <span
            class="px-3 py-1.5 transition-colors duration-300"
            :class="{
              'bg-blue-600 text-white': currentLanguage === 'ar',
              'text-gray-600 dark:text-gray-300 hover:text-blue-600 cursor-pointer':
                currentLanguage === 'en',
            }"
            >{{ currentLanguage === "en" ? "AR" : "عربي" }}</span
          >
        </button>

        <!-- Dark Mode Toggle -->
        <button class="hover:cursor-pointer" @click="toggleDarkMode">
          <svg
            v-if="!isDarkMode"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"
            />
          </svg>
        </button>

        <template v-if="!isAuthenticated">
          <BaseButton
            @click="showSigninForm = true"
            class="bg-blue-600 text-white px-2 lg:px-4 py-2 hover:bg-blue-700"
          >
            {{ $t("sign_in") }}
          </BaseButton>
          <BaseButton
            @click="showSignupForm = true"
            class="text-blue-600 hover:text-blue-800 border-1 border-blue-600 px-2 lg:px-4 py-2"
          >
            {{ $t("sign_up") }}
          </BaseButton>
        </template>

        <!-- Show user dropdown when authenticated -->
        <template v-else>
          <div class="relative">
            <div class="flex items-center">
              <avatar :placeholderText="username"></avatar>
              <div
                @click="toggleUserMenu"
                class="flex items-center space-x-2 cursor-pointer py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
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
              <notification-dropdown v-if="!$store.state.user?.isAdmin" />
            </div>

            <!-- User Dropdown Menu -->
            <div
              v-if="isUserMenuOpen"
              v-click-outside="closeUserMenu"
              :class="[
                'absolute mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50',
                $i18n.locale === 'ar' ? 'left-0' : 'right-0',
              ]"
              @click.stop
            >
              <RouterLink
                v-if="$store.state.user?.isAdmin"
                @click="closeUserMenu"
                to="/dashboard"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {{ $t("dashboard") }}
                </div>
              </RouterLink>
              <RouterLink
                v-else
                to="/profile"
                @click="closeUserMenu"
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
                  {{ $t("profile") }}
                </div>
              </RouterLink>
              <RouterLink
                to="/settings"
                class="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="closeUserMenu"
              >
                <i class="fas fa-cog mr-2"></i>
                {{ $t("settings") }}
              </RouterLink>
              <button
                @click="
                  handleLogout();
                  closeUserMenu();
                "
                class="w-full flex items-end gap-1 cursor-pointer px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>
                {{ $t("logout") }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Mobile Menu (shown when isMenuOpen = true) -->
      <transition name="fade">
        <div
          v-if="isMenuOpen"
          class="fixed top-12 sm:top-16 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-md bg-white shadow-md p-4 md:hidden dark:bg-gray-800 dark:text-white rounded-lg border-t dark:border-gray-700"
        >
          <!-- Mobile Nav Links -->
          <ul class="flex flex-col space-y-3 mb-4 text-center">
            <li>
              <RouterLink
                to="/"
                class="nav-link hover:text-blue-600"
                @click="closeMenu"
                >{{ $t("home") }}</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/register-venue"
                class="nav-link hover:text-blue-600"
                @click="closeMenu"
                >{{ $t("share_venue") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/book-now"
                class="nav-link hover:text-blue-600"
                @click="closeMenu"
                >{{ $t("book_now") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/about"
                class="nav-link hover:text-blue-600"
                @click="closeMenu"
                >{{ $t("about") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/contact"
                class="nav-link hover:text-blue-600"
                :class="{ 'text-blue-600 active': $route.path === '/contact' }"
                @click="closeMenu"
                >{{ $t("contact") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/FAQs"
                class="nav-link hover:text-blue-600"
                @click="closeMenu"
                >{{ $t("faqs") }}
              </RouterLink>
            </li>
          </ul>

          <!-- Mobile Auth Buttons -->
          <div class="flex flex-col space-y-4 items-center">
            <!-- Language Toggle -->
            <button
              class="flex items-center justify-center space-x-1"
              @click="toggleLanguage"
            >
              <span
                class="px-3 py-1.5 transition-colors duration-300"
                :class="{
                  'bg-blue-600 text-white': currentLanguage === 'en',
                  'text-gray-600 dark:text-gray-300 hover:text-blue-600 cursor-pointer':
                    currentLanguage === 'ar',
                }"
                >EN</span
              >
              <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <span
                class="px-3 py-1.5 transition-colors duration-300"
                :class="{
                  'bg-blue-600 text-white': currentLanguage === 'ar',
                  'text-gray-600 dark:text-gray-300 hover:text-blue-600 cursor-pointer':
                    currentLanguage === 'en',
                }"
                >{{ currentLanguage === "en" ? "AR" : "عربي" }}</span
              >
            </button>

            <!-- Dark Mode Toggle -->
            <button
              class="hover:cursor-pointer flex items-center justify-center"
              @click="toggleDarkMode"
            >
              <svg
                v-if="!isDarkMode"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"
                />
              </svg>
            </button>
            <template v-if="!isAuthenticated">
              <BaseButton
                @click="
                  closeMenu;
                  showSigninForm = true;
                "
                class="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 w-full rounded-lg text-sm font-medium"
              >
                {{ $t("sign_in") }}
              </BaseButton>
              <BaseButton
                @click="
                  closeMenu;
                  showSignupForm = true;
                "
                class="text-blue-600 hover:text-blue-800 border border-blue-600 px-4 py-2 w-full rounded-lg text-sm font-medium"
              >
                {{ $t("sign_up") }}
              </BaseButton>
            </template>

            <!-- Show user profile options when authenticated -->
            <template v-else>
              <div
                class="border-t border-gray-200 dark:border-gray-600 pt-4 w-full"
              >
                <div class="flex items-center justify-center mb-4">
                  <avatar :placeholderText="username" class="mr-3"></avatar>
                  <RouterLink
                    v-if="$store.state.user?.isAdmin"
                    to="/dashboard"
                    class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                    @click="closeMenu"
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
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                      {{ $t("dashboard") }}
                    </div>
                  </RouterLink>

                  <RouterLink
                    v-else
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
                    {{ $t("profile") }}
                  </RouterLink>
                </div>

                <!-- Other menu items (centered) -->
                <div class="flex flex-col items-center">
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
                    {{ $t("settings") }}
                  </RouterLink>

                  <button
                    @click="
                      handleLogout();
                      closeMenu();
                    "
                    class="flex items-center px-2 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
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
                    {{ $t("logout") }}
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </nav>

  <!-- Add a spacer to prevent content from being hidden under the navbar -->
  <div class="h-14 sm:h-16"></div>

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
import { getAuth, signOut } from "firebase/auth";
import avatar from "../UserAvatar/Avatar.vue";
import NotificationDropdown from "@/components/layouts/NotificationDropdown.vue";

export default {
  data() {
    return {
      isUserMenuOpen: false,
      isMenuOpen: false,
      showSignupForm: false,
      showSigninForm: false,
      isScrolled: false,
      scrollY: 0,
      currentLanguage: "en",
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    username() {
      return this.$store.state.user?.name || "Guest";
    },
    isDarkMode() {
      return store.state.isDarkMode;
    },
  },
  components: {
    Signup,
    Signin,
    avatar,
    NotificationDropdown,
  },
  mounted() {
    // Add scroll event listener
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    // Check initial scroll position
    this.handleScroll();
  },
  beforeUnmount() {
    // Clean up the event listener when component is unmounted
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    toggleLanguage() {
      if (this.currentLanguage === "en") {
        this.currentLanguage = "ar";
        this.$i18n.locale = "ar";
      } else {
        this.currentLanguage = "en";
        this.$i18n.locale = "en";
      }
    },

    handleScroll() {
      // Get current scroll position
      this.scrollY = window.scrollY;
      // Check if page is scrolled more than 20px
      this.isScrolled = this.scrollY > 20;
    },
    closeUserMenu() {
      this.isUserMenuOpen = false;
    },
    toggleDarkMode() {
      store.commit("toggleDarkMode"); // Commit the mutation
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    toggleUserMenu(event) {
      event.stopPropagation(); // Prevent the click event from bubbling up
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    async handleLogout() {
      try {
        const auth = getAuth();
        await signOut(auth);

        // Clear user data from store
        store.state.user = null;
        store.state.isAuthenticated = false;
        this.isUserMenuOpen = false; // Ensure the user menu is closed
        this.isMenuOpen = false; // Ensure the mobile menu is closed
        console.log("User logged out successfully");
        this.$router.push("/");
      } catch (err) {
        console.error("Unexpected logout error:", err);
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    closeNotifications() {
      this.showNotifications = false;
    },
    markAsRead(notificationId) {
      this.$store.commit("markNotificationAsRead", notificationId);
    },
    formatNotificationTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal) {
        this.isUserMenuOpen = false; // Ensure the user menu is closed when authenticated
        this.isMenuOpen = false; // Ensure the mobile menu is closed when authenticated
      }
    },
  },
};
</script>

<style scoped>
/* Simple fade transition for the mobile menu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.45s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  will-change: opacity;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Language toggle button styles */
.language-toggle-btn {
  overflow: hidden;
}

.toggle-slider {
  top: 4px;
  left: 4px;
  transition: transform 0.3s cubic-bezier(0.4, 0.01, 0.165, 0.99);
}

/* Enhanced navigation transitions */
.nav-link {
  position: relative;
  transition: color 0.35s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  padding-bottom: 2px;
  backface-visibility: hidden;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -1px;
  left: 0;
  background-color: currentColor;
  transition: width 0.35s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  will-change: width;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Smooth transition for the navigation bar itself */
nav {
  transition: background-color 0.45s cubic-bezier(0.4, 0.01, 0.165, 0.99),
    box-shadow 0.45s cubic-bezier(0.4, 0.01, 0.165, 0.99),
    backdrop-filter 0.45s cubic-bezier(0.4, 0.01, 0.165, 0.99),
    transform 0.45s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  will-change: background-color, box-shadow, backdrop-filter;
  backface-visibility: hidden;
}

/* Add a subtle animation for dropdown menus */
.nav-dropdown-enter-active,
.nav-dropdown-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0.01, 0.165, 0.99),
    transform 0.4s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  transform-origin: top;
  will-change: opacity, transform;
  backface-visibility: hidden;
}

.nav-dropdown-enter-from,
.nav-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
