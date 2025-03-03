<template>
  <!-- Responsive grid of reservation cards -->

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <VenueCard
      v-for="reservation in reservations"
      :key="reservation.id"
      :source="reservation.pictures[0]"
      :title="reservation.name"
      :description="reservation.shortDescription"
      :price="reservation.price"
      :id="reservation.id"
    />
  </div>
</template>

<script>
import store from "@/store/store";
import VenueCard from "./VenueCard.vue";

export default {
  components: {
    VenueCard,
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
