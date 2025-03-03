<template>
  <div
    class="min-h-screen w-full bg-white text-gray-800 font-sans flex flex-col dark:bg-gray-800 dark:text-white"
  >
    <h1 class="font-bold text-3xl text-center my-4 text-blue-600">
      Reserve Your Spot
    </h1>

    <div class="w-full md:w-11/12 md:mx-auto">
      <section class="mt-12 px-6 md:px-16">
        <VenueCardList />
      </section>
    </div>
  </div>
</template>

<script>
import VenueCardList from "../components/reservations/VenueCardList.vue";

export default {
  name: "bookNow",
  components: {
    VenueCardList,
  },
};
</script>

<style scoped></style>
