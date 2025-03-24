<!-- filepath: c:\Users\HP\OneDrive\Desktop\My proj\Reservio\components\OfflinePopup.vue -->
<template>
  <div v-if="!isOnline" class="offline-popup">
    You are offline. Please check your connection.
  </div>
</template>

<script>
import { Offline } from "vue-offline";

export default {
  components: {
    Offline,
  },
  data() {
    return {
      isOnline: true,
    };
  },
  mounted() {
    // Listen for online/offline events
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
    this.updateOnlineStatus(); // Set initial status
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
  methods: {
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
    },
  },
};
</script>

<style scoped>
.offline-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff4d4d;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 1000;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>