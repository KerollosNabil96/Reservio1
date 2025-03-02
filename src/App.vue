<script>
import { RouterLink, RouterView } from "vue-router";
import Signin from "./components/registration/Signin.vue";
import Signup from "./components/registration/Signup.vue";
import TheNavbar from "./components/TheNavbar.vue";

import store from "./store/store";
import HomePage from "./views/HomePage.vue";
export default {
  components: {
    Signin,
    Signup,
    TheNavbar,
    HomePage,
  },
  computed: {
    dark() {
      return store.state.isDarkMode;
    },
  },
};
</script>

<template>
  <div :class="{ dark: dark }">
    <TheNavbar />
    <RouterView />
  </div>
</template>
