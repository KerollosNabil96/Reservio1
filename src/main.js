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
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: {
    en,
    ar,
  },
});

const app = createApp(App);

app.use(i18n);

app.use(router);
app.use(store);
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
