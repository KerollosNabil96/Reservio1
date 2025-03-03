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
      store.state.showSignup = false;
    },
    hideSignIn() {
      store.state.showSignin = false;
    },
  },
};
</script>

<template>
  <div class="dark:bg-gray-800" :class="{ dark: dark }">
    <TheNavbar />
    <RouterView />
    <TheFooter />
  </div>
</template>
