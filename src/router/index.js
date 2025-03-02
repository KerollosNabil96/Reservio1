import Signin from "@/components/registration/Signin.vue";
import Signup from "@/components/registration/Signup.vue";
import ReservationDetails from "@/components/reservations/ReservationDetails.vue";
import HomePage from "@/views/HomePage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomePage },
    { path: "/signin", component: Signin },
    { path: "/signup", component: Signup },
    { path: "/reservation/:id", component: ReservationDetails, props: true },
  ],
});

export default router;
