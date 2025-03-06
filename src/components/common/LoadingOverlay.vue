<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black/80 0 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center">
      <div class="spinner mb-4"></div>
      <p class="text-gray-700 dark:text-gray-200">Loading...</p>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";

export default {
  name: "LoadingOverlay",
  computed: {
    isLoading() {
      return store.state.isLoading;
    },
  },
};
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-color-scheme: dark) {
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: #818cf8;
  }
}
</style>
