<template>
  <div class="main-content">
    <div class="booking-section">
      <div class="booking-header text-xl md:text-2xl font-bold dark:text-white">
        <h1 class="text-2xl font-bold text-green-600 mb-6">Venues List</h1>
      </div>
    </div>
  </div>
  <div v-if="filteredVenues.length === 0" class="no-bookings">
    <p>No Venues To Display</p>
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <VenueCard
      v-for="venue in filteredVenues"
      :key="venue.id"
      :source="venue.pictures[0]"
      :title="venue.venueName"
      :description="venue.shortDescription"
      :price="venue.price"
      :id="venue.id"
    />
  </div>
</template>

<script>
import VenueCard from "../reservations/VenueCard.vue";
import store from "@/store/store";
export default {
  components: {
    VenueCard,
  },
  computed: {
    filteredVenues() {
      const userVenues = store.getters.getReservations.filter((ele) => {
        return this.$store.state.user.email == ele.owner;
      });
      return userVenues;
    },
  },
};
</script>
<style scoped>
.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
}
.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.no-bookings {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}
</style>
