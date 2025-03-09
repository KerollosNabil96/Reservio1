<template>
  <div class="avatar" :style="avatarStyle">
    <img v-if="src" :src="src" alt="Avatar" class="avatar-image" />
    <div v-else class="avatar-placeholder">
      {{ getFirstChars(placeholderText) }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    src: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 25, // Default size in pixels
    },
    placeholderText: {
      type: String,
      default: "R", // Default placeholder text
    },
  },
  methods: {
    getFirstChars(inputString) {
      const words = inputString.split(" ");
      const firstChars = words.map((word) => word.charAt(0));
      return firstChars.join("");
    },
  },
  computed: {
    avatarStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        lineHeight: `${this.size}px`,
        fontSize: `${this.size * 0.5}px`,
      };
    },
  },
};
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #51a2ff; /* Fallback background color */
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the circle */
}

.avatar-placeholder {
  text-align: center;
  color: #fff;
  /* font-weight: bold; */
  text-transform: uppercase;
}
</style>
