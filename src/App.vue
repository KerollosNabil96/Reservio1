<script>
import store from "./store/store";
import TheNavbar from "./components/layouts/TheNavbar.vue";
import TheFooter from "./components/layouts/TheFooter.vue";
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
  },
  methods: {
    hideSignUp() {
      store.commit("setShowSignup", false);
    },
    hideSignIn() {
      store.commit("setShowSignin", false);
    },
  },
};
</script>

<template>
  <div class="dark:bg-gray-800" :class="{ dark: dark }">
    <TheNavbar />
    <transition name="page" mode="out-in">
      <RouterView />
    </transition>
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
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
