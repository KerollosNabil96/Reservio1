<template>
  <button :class="styles"><slot></slot></button>
</template>

<script>
export default {
  computed: {
    styles() {
      return `hover:cursor-pointer transition-all rounded-md`;
    },
  },
};
</script>
