import About from "@/components/About/About.vue";
import Signin from "@/components/registration/Signin.vue";
import Signup from "@/components/registration/Signup.vue";
import ReservationDetails from "@/components/reservations/ReservationDetails.vue";
import BookNow from "@/views/BookNow.vue";
import FrequentlyAsked from "@/views/FrequentlyAsked.vue";
import HomePage from "@/views/HomePage.vue";
import NotFound from "@/views/NotFound.vue";
import VenueRegistration from "@/views/VenueRegistration.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomePage },
    { path: "/signin", component: Signin },
    { path: "/signup", component: Signup },
    { path: "/register-venue", component: VenueRegistration },
    { path: "/about", component: About },
    { path: "/bookNow", component: BookNow },
    { path: "/reservation/:id", component: ReservationDetails, props: true },
    { path: "/FAQs", component: FrequentlyAsked },
    { path: "/:notFound(.*)", component: NotFound },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
