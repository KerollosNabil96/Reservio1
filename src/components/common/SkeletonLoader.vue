<template>
  <div
    :class="[
      'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
      { 'w-full': width === 'full' },
      { 'h-full': height === 'full' },
    ]"
    :style="{
      width:
        typeof width === 'number'
          ? `${width}px`
          : width === 'full'
          ? '100%'
          : width,
      height:
        typeof height === 'number'
          ? `${height}px`
          : height === 'full'
          ? '100%'
          : height,
      borderRadius: rounded,
    }"
  ></div>
</template>

<script>
export default {
  name: "SkeletonLoader",
  props: {
    width: {
      type: [String, Number],
      default: "full",
    },
    height: {
      type: [String, Number],
      default: "20px",
    },
    rounded: {
      type: String,
      default: "0.375rem", // Equivalent to rounded-md
    },
  },
};
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
