<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ReservationCard
        v-for="reservation in reservations"
        :key="reservation.id"
        :source="reservation.image"
        :title="reservation.title"
        :description="reservation.description"
        :price="reservation.price"
        :id="reservation.id"
      />
    </div>
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
