import "./assets/main.css";
import "./assets/animations.css";
import "./assets/page-transitions.css";

import { createApp } from "vue";
import App from "./App.vue";
import clickOutside from "./directives/click-outside";
import router from "./router";
import store from "./store/store";
import "./firebase";

import BaseButton from "./components/base/BaseButton.vue";

const app = createApp(App);

app.use(router);
app.use(store);

app.component("BaseButton", BaseButton);
app.directive("click-outside", clickOutside);
app.mount("#app");
