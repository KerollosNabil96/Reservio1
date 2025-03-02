<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <img
      src="../../assets/pictures/Screenshot 2025-03-01 185349.png"
      class="h-48 w-full object-cover"
    />
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2">{{ title }}</h3>
      <p class="text-gray-600 text-sm mb-4">
        {{ description }}
      </p>
      <div class="flex justify-between items-center">
        <span class="text-indigo-600 font-bold">${{ price }}</span>
        <BaseButton
          class="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
        >
          <router-link :to="`/reservation/${id}`"> Reserve Now </router-link>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["source", "title", "description", "price", "id"],
};
</script>
