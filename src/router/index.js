import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/store";

import About from "@/components/About/About.vue";
import Signin from "@/components/registration/Signin.vue";
import Signup from "@/components/registration/Signup.vue";
import AfterRegForm from "@/views/AfterRegForm.vue";
import BookNow from "@/views/BookNow.vue";
import FrequentlyAsked from "@/views/FrequentlyAsked.vue";
import HomePage from "@/views/HomePage.vue";
import NotFound from "@/views/NotFound.vue";
import VenueDetails from "@/views/VenueDetails.vue";
import VenueRegistration from "@/views/VenueRegistration.vue";
import Payment from "@/views/Payment.vue";
import Profile from "@/views/Profile.vue";
import Settings from "@/views/Settings.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/signin", component: Signin },
  { path: "/signup", component: Signup },
  { path: "/register-venue", component: VenueRegistration },
  { path: "/about", component: About },
  { path: "/book-now", component: BookNow },
  { path: "/book-now/:id", component: VenueDetails, props: true },
  { path: "/FAQs", component: FrequentlyAsked },
  { path: "/afterRegForm", component: AfterRegForm, meta: { requiresAuth: true } },
  { path: "/payment", component: Payment , meta: { requiresAuth: true } },
  { path: "/profile", component: Profile , meta: { requiresAuth: true } },
  { path: "/settings", component: Settings , meta: { requiresAuth: true } },
  { path: "/:notFound(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/"); 
  } else {
    next();
  }
});

export default router;
