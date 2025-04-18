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
import Contact from "@/views/Contact.vue";
import VenueRegistration from "@/views/VenueRegistration.vue";
import Payment from "@/views/Payment.vue";
import Profile from "@/views/Profile.vue";
import Settings from "@/views/Settings.vue";
import BookingInfo from "@/views/BookingInfo.vue";
import PaymentAccess from "@/views/PaymentAccess.vue";
import BookingInfoPayment from "@/views/BookingInfoPayment.vue";
import PaymentSuccess2 from "@/views/PaymentSuccess2.vue";
import Dashboard from "@/views/Dashboard.vue";
import BookingSuccess from "../views/BookingSuccess.vue";
import BookingCancelled from "../views/BookingCancelled.vue";
import DashboardView from "../components/Dashboard/DashboardView.vue";
import Wallet from "@/components/Dashboard/Wallet.vue";
import Bookings from "@/components/Dashboard/Bookings.vue";
import UserVenues from "@/components/Dashboard/UserVenues.vue";
import RegistrationSuccess from "@/views/RegistrationSuccess.vue";
import RegistrationCancelled from "@/views/RegistrationCancelled.vue";
import VenueRegistrationPayment from "@/views/VenueRegistrationPayment.vue";
import ResetPassword from "@/views/ResetPassword.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/signin", component: Signin },
  { path: "/signup", component: Signup },
  { path: "/register-venue", component: VenueRegistration },
  { path: "/about", component: About },
  { path: "/book-now", component: BookNow },
  { path: "/book-now/:id", component: VenueDetails, props: true },
  { path: "/FAQs", component: FrequentlyAsked },
  { path: "/contact", component: Contact },
  { path: "/reset-password", component: ResetPassword },

  {
    path: "/afterRegForm",
    component: AfterRegForm,
    meta: { requiresAuth: true },
  },
  { path: "/payment", component: Payment, meta: { requiresAuth: true } },
  { path: "/wallet", component: Wallet, meta: { requiresAuth: true } },
  {
    path: "/profile",
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/profile/bookings",
      },
      {
        path: "wallet",
        component: Wallet,
      },
      {
        path: "bookings",
        component: Bookings,
      },
      {
        path: "user-venues",
        component: UserVenues,
      },
    ],
  },
  { path: "/settings", component: Settings, meta: { requiresAuth: true } },
  {
    path: "/booking-info",
    component: BookingInfo,
    meta: { requiresAuth: true },
  },
  {
    path: "/booking-info-payment",
    name: "BookingInfoPayment",
    component: BookingInfoPayment,
    meta: { requiresAuth: true },
  },
  {
    path: "/venueRegistrationPayment",
    component: VenueRegistrationPayment,
    meta: { requiresAuth: true },
  },
  {
    path: "/paymentSuccess",
    component: PaymentAccess,
    meta: { requiresAuth: true },
  },
  {
    path: "/afterRegForm",
    component: AfterRegForm,
    meta: { requiresAuth: true },
  },
  { path: "/payment", component: Payment, meta: { requiresAuth: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/settings", component: Settings, meta: { requiresAuth: true } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/bookigInfo", component: BookingInfo, meta: { requiresAuth: true } },
  {
    path: "/pending",
    component: PaymentSuccess2,
    meta: { requiresAuth: true },
  },
  {
    path: "/booking-success",
    name: "BookingSuccess",
    component: BookingSuccess,
  },
  {
    path: "/booking-cancelled",
    name: "BookingCancelled",
    component: BookingCancelled,
  },
  {
    path: "/registration-success",
    name: "RegistrationSuccess",
    component: RegistrationSuccess,
  },
  {
    path: "/registration-cancelled",
    name: "RegistrationCancelled",
    component: RegistrationCancelled,
  },
  { path: "/:notFound(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (
      from.path === to.path &&
      to.query.tab !== from.query.tab &&
      Object.keys(to.query).length === Object.keys(from.query).length
    ) {
      return false;
    }

    if (savedPosition) {
      return {
        ...savedPosition,
        behavior: "smooth",
      };
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 90,
      };
    }

    return {
      top: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
