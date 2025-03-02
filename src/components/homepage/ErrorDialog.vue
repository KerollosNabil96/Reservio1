<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto"
    @click="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
      <div class="flex items-center text-red-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 class="text-lg font-medium">{{ title }}</h3>
      </div>
      <p class="mb-4">{{ message }}</p>
      <slot></slot>
      <div class="flex justify-end">
        <BaseButton
          @click="$emit('close')"
          class="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
        >
          {{ buttonText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "../base/BaseButton.vue";

export default {
  name: "ErrorDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Error",
    },
    message: {
      type: String,
      default: "An error occurred.",
    },
    buttonText: {
      type: String,
      default: "OK",
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
  },
  beforeUnmount() {
    // Ensure scroll is restored when component is destroyed
    document.body.style.overflow = "";
  },
  emits: ["close"],
};
</script>
