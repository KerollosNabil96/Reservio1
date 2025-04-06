<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-white bg-opacity-80 dark:bg-slate-900 dark:bg-opacity-80 backdrop-blur-sm"
  >
    <svg
      class="h-16 w-16 text-primary-600 dark:text-primary-400 animate-pulse-grow"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: "GlobalLoader",
};
</script>

<style scoped>
/* Enhance the animation */
@keyframes pulse-grow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.75;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.animate-pulse-grow {
  animation: pulse-grow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Use logo colors */
.text-primary-600 {
  color: #3b82f6; /* blue-500 */
}
.dark .text-primary-400 {
  color: #60a5fa; /* blue-400 */
}
</style>
