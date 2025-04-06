import "./assets/main.css";
import "./assets/animations.css";
import "./assets/page-transitions.css";

import { createApp } from "vue";
import App from "./App.vue";
import clickOutside from "./directives/click-outside";
import router from "./router";
import store from "./store/store";
import { auth, onAuthStateChanged, db, ref, onValue } from "./firebase"; // Import necessary Firebase auth functions
import BaseButton from "./components/base/BaseButton.vue";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Load initial locale from store (which loads from localStorage)
const initialLocale = store.state.currentLocale;

const i18n = createI18n({
  legacy: false, // Recommended for Composition API usage
  locale: initialLocale, // Use loaded locale
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
  pluralizationRules: {
    ar: function (choice, choicesLength) {
      // Arabic has different plural forms
      return choice === 0
        ? 0
        : choice === 1
        ? 1
        : choice === 2
        ? 2
        : choice >= 3 && choice <= 10
        ? 3
        : 4;
    },
  },
});

const app = createApp(App);

// Start loading immediately
const loadingStartTime = Date.now(); // Record start time
// store.dispatch("setLoadingState", true); // No longer needed for initial static loader

// Function to potentially hide the static loader
const hideLoader = () => {
  const staticLoader = document.getElementById("static-loader");
  if (!staticLoader) return; // Guard clause

  const elapsedTime = Date.now() - loadingStartTime;
  const remainingTime = 1000 - elapsedTime;

  const removeLoader = () => {
    staticLoader.classList.add("hidden");
    // Optional: Remove the element completely after the transition
    setTimeout(() => {
      staticLoader.remove();
    }, 500); // Match the CSS transition duration
    console.log("Static loader hidden.");
  };

  if (remainingTime <= 0) {
    removeLoader();
  } else {
    setTimeout(removeLoader, remainingTime);
  }
};

// Wait for Firebase auth state to be resolved before mounting
let isAppMounted = false;
let authChecked = false;
let venuesLoaded = false;

const checkCompletion = () => {
  if (authChecked && venuesLoaded) {
    hideLoader();
  }
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Initial auth check: User is signed in");
    // Fetch user data from database (moved from App.vue)
    try {
      const usersRef = ref(db, "users/");
      const snapshot = await new Promise((resolve) =>
        onValue(usersRef, resolve, { onlyOnce: true })
      );
      const allUsers = snapshot.val();
      let foundUser = null;
      if (allUsers) {
        for (const username in allUsers) {
          const currentUser = allUsers[username];
          if (currentUser.email === user.email) {
            foundUser = currentUser;
            break;
          }
        }
      }
      store.dispatch("updateAuthState", foundUser);
    } catch (error) {
      console.error("Error fetching user data on init:", error);
      store.dispatch("updateAuthState", null); // Ensure state is clear on error
    }
  } else {
    console.log("Initial auth check: User is signed out");
    store.dispatch("updateAuthState", null);
  }

  authChecked = true; // Mark auth as checked
  checkCompletion(); // Check if loading can finish

  // Mount the app only once after the initial auth check
  if (!isAppMounted) {
    app.use(i18n);
    app.use(router);
    app.use(store);
    // Initialize theme after store is used
    store.dispatch("initializeTheme");
    app.use(Toast, {
      position: "top-right",
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: "button",
      icon: true,
      rtl: false,
    });

    app.component("BaseButton", BaseButton);
    app.directive("click-outside", clickOutside);

    app.mount("#app");
    isAppMounted = true;
  }

  // Fetch venues after auth state is confirmed and app potentially mounted
  const venuesRef = ref(db, "/venues");
  onValue(
    venuesRef,
    (snapshot) => {
      const data = snapshot.val();
      let venues = [];
      for (const venue in data) {
        const current = data[venue];
        venues.push(current);
      }
      store.commit("setReservations", venues);
      console.log("Venues loaded.");
      venuesLoaded = true; // Mark venues as loaded
      checkCompletion(); // Check if loading can finish
    },
    (error) => {
      console.error("Error fetching venues:", error);
      venuesLoaded = true; // Also mark as 'loaded' on error to proceed
      checkCompletion(); // Check if loading can finish even on error
    }
  );
});

// Removed theme handling logic from here as it's handled by the store's initializeTheme action
// Removed global property $setTheme as theme is managed via store
