<script>
import store from "./store/store";
import TheNavbar from "./components/layouts/TheNavbar.vue";
import TheFooter from "./components/layouts/TheFooter.vue";
import { auth, onAuthStateChanged, db, ref, onValue } from "./firebase";
export default {
  components: {
    TheNavbar,
    TheFooter,
  },
  computed: {
    dark() {
      return store.state.isDarkMode;
    },
    showSignUp() {
      return store.state.showSignup;
    },
    showSignIn() {
      return store.state.showSignin;
    },
    loading() {
      return store.state.isLoading;
    },
  },
  watch: {
    // Watch for changes in isDarkMode and update the <html> element
    dark(newVal) {
      if (newVal) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
  methods: {
    hideSignUp() {
      store.commit("setShowSignup", false);
    },
    hideSignIn() {
      store.commit("setShowSignin", false);
    },
  },
  created() {
    // Initialize dark mode on app load
    if (store.state.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Set loading state to true when app starts
    store.dispatch("setLoadingState", true);

    // Set up Firebase auth state listener to persist user login
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        // Fetch user data from database
        const usersRef = ref(db, "users/");
        onValue(usersRef, (snapshot) => {
          const allUsers = snapshot.val();
          if (allUsers) {
            for (const username in allUsers) {
              const currentUser = allUsers[username];
              if (currentUser.email === user.email) {
                // Update store with user info
                store.dispatch("updateAuthState", currentUser);
                return;
              }
            }
          }
        });
      } else {
        // User is signed out
        console.log("User is signed out");
        store.dispatch("updateAuthState", null);
      }
    });
    const venuesRef = ref(db, "/venues");
    onValue(venuesRef, (snapshot) => {
      const data = snapshot.val();
      let venues = [];
      for (const venue in data) {
        const current = data[venue];
        venues.push(current);
      }
      store.state.reservations = venues;
      // Set loading state to false after venues are loaded
      store.dispatch("setLoadingState", false);
    });
  },
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheNavbar />
    <main class="flex-grow flex flex-col">
      <transition name="fade" mode="out-in">
        <RouterView />
      </transition>
    </main>
    <TheFooter />
  </div>
</template>

<style>
/* Optimize dark mode transitions */
html {
  transition: background-color 0.2s ease;
}

html.dark * {
  transition: background-color 0.2s ease;
}

/* Text color transitions happen immediately */
html.dark h1,
html.dark h2,
html.dark h3,
html.dark h4,
html.dark h5,
html.dark h6,
html.dark p,
html.dark span,
html.dark a,
html.dark div,
html.dark label {
  transition: color 0s;
}

/* Background transitions are slightly delayed for a smoother effect */
.bg-white,
.bg-gray-50,
.bg-gray-100,
.bg-gray-200,
.bg-gray-800,
.bg-gray-900 {
  transition: background-color 0.2s ease;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* For components that zoom in/out */
.zoom-enter-active,
.zoom-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* For sliding transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-left-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-left-leave-to,
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

/* For dialog/modal animations */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
