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
  locale: "en", // default locale
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

// Load theme from localStorage or default to 'light'
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

// Function to toggle theme and save it to localStorage
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Make setTheme globally accessible (optional)
app.config.globalProperties.$setTheme = setTheme;

app.use(i18n);

app.use(router);
app.use(store);
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
