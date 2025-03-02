<template>
  <!-- Responsive grid of reservation cards -->
  <h2 class="text-2xl font-bold mb-6">Available Reservations</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <ReservationCard
      v-for="reservation in reservations"
      :key="reservation.id"
      :source="reservation.image"
      :title="reservation.name"
      :description="reservation.description"
      :price="reservation.price"
      :id="reservation.id"
    />
  </div>
</template>

<script>
import store from "@/store/store";
import ReservationCard from "./ReservationCard.vue";

export default {
  components: {
    ReservationCard,
  },
  data() {
    return {};
  },
  computed: {
    reservations() {
      return store.getters.getReservations;
    },
  },
};
</script>
