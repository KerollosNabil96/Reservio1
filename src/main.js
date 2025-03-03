import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";

import BaseButton from "./components/base/BaseButton.vue";

// Initialize the auth state before mounting the app
store.dispatch('initAuth');

const app = createApp(App);

app.use(router);
app.use(store);

app.component("BaseButton", BaseButton);

app.mount("#app");
