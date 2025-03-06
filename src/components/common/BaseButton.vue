<template>
  <button
    :type="type"
    :class="[
      'relative overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
      roundedClasses,
      { 'cursor-wait': loading },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-inherit"
    >
      <svg
        class="animate-spin h-5 w-5"
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

    <!-- Button content with fade transition -->
    <transition name="fade">
      <div
        :class="{ 'opacity-0': loading }"
        class="flex items-center justify-center transition-opacity duration-200"
      >
        <slot></slot>
      </div>
    </transition>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    type: {
      type: String,
      default: "button",
    },
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        [
          "primary",
          "secondary",
          "success",
          "danger",
          "warning",
          "info",
          "light",
          "dark",
        ].includes(value),
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
    },
    rounded: {
      type: String,
      default: "md",
      validator: (value) => ["none", "sm", "md", "lg", "full"].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sizeClasses() {
      return {
        "px-2.5 py-1.5 text-xs": this.size === "sm",
        "px-4 py-2 text-sm": this.size === "md",
        "px-5 py-2.5 text-base": this.size === "lg",
        "px-6 py-3 text-lg": this.size === "xl",
      };
    },
    variantClasses() {
      const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary:
          "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        success:
          "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        warning:
          "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500",
        info: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-500",
        light:
          "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",
        dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700",
      };
      return variants[this.variant];
    },
    roundedClasses() {
      return {
        "rounded-none": this.rounded === "none",
        rounded: this.rounded === "sm",
        "rounded-md": this.rounded === "md",
        "rounded-lg": this.rounded === "lg",
        "rounded-full": this.rounded === "full",
      };
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
