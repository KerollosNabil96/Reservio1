<template>
  <div class="spinner-container" v-if="show">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'BaseSpinner',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff; /* White color for better visibility on blue button */
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode support */
.dark .spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: #3b82f6;
}
</style>