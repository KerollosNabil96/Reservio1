<template>
  <div class="pb-8">
    <VenueReview :venue-id="venueId" @show-signin="$emit('show-signin')" />
  </div>
</template>

<script>
import VenueReview from "@/components/venue/VenueReview.vue";

export default {
  name: "ReviewsTab",
  components: {
    VenueReview,
  },
  props: {
    venueId: {
      type: String,
      required: true,
    },
  },
  emits: ["show-signin"],
};
</script>
