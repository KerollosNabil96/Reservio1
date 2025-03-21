<template>
  <div class="relative">
    <!-- Notification Bell Icon with Badge -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
    >
      <span class="sr-only">{{ $t("notifications") }}</span>
      <i class="fas fa-bell text-xl cursor-pointer"></i>
      <!-- Notification Badge -->
      <span
        v-if="unreadCount > 0"
        :class="[
          'absolute -top-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center',
          $i18n.locale === 'ar' ? '-left-1' : '-right-1',
        ]"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Notification Dropdown -->
    <div
      v-if="isOpen"
      :class="[
        'absolute mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50',
        $i18n.locale === 'ar' ? 'left-0' : 'right-0',
      ]"
      @click.stop
    >
      <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ $t("notifications") }}
        </h3>
      </div>

      <!-- Notifications List -->
      <div class="max-h-96 overflow-y-auto">
        <div
          v-if="notifications.length === 0"
          class="p-4 text-center text-gray-500"
        >
          {{ $t("no_notifications") }}
        </div>
        <div
          v-for="notification in sortedNotifications"
          :key="notification.id"
          :class="[
            'p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
            { 'bg-blue-50 dark:bg-blue-900/20': !notification.read },
          ]"
          @click="markAsRead(notification.id)"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm text-gray-800 dark:text-gray-200">
                {{ $t(notification.message, notification.params) }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formatTimestamp(notification.timestamp) }}
              </p>
            </div>
            <div class="flex items-center">
              <div
                v-if="!notification.read"
                class="w-2 h-2 bg-blue-500 rounded-full mr-2"
              ></div>
              <button
                @click.stop="removeNotification(notification.id)"
                class="text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Remove notification"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { db, ref as dbRef, onValue, update, remove } from "@/firebase";

export default {
  name: "NotificationDropdown",
  setup() {
    const store = useStore();
    const isOpen = ref(false);
    const notifications = ref([]);

    // Compute unread notifications count
    const unreadCount = computed(() => {
      return notifications.value.filter((n) => !n.read).length;
    });

    // Sort notifications by timestamp, newest first
    const sortedNotifications = computed(() => {
      return [...notifications.value].sort((a, b) => b.timestamp - a.timestamp);
    });

    // Toggle dropdown
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString();
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
      const userId = store.state.user?.id;
      if (!userId) return;

      try {
        const notificationRef = dbRef(
          db,
          `users/${userId}/notifications/${notificationId}`
        );
        await update(notificationRef, { read: true });
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    };

    // Listen for notifications changes
    onMounted(() => {
      const userId = store.state.user?.id;
      if (!userId) return;

      const notificationsRef = dbRef(db, `users/${userId}/notifications`);
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          notifications.value = Object.entries(data).map(
            ([id, notification]) => ({
              id,
              ...notification,
            })
          );
        } else {
          notifications.value = [];
        }
      });

      // Cleanup listener
      onUnmounted(() => {
        unsubscribe();
      });
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isOpen.value && !event.target.closest(".relative")) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    // Remove notification
    const removeNotification = async (notificationId) => {
      const userId = store.state.user?.id;
      if (!userId) return;

      try {
        const notificationRef = dbRef(
          db,
          `users/${userId}/notifications/${notificationId}`
        );
        await remove(notificationRef);
        // No need to manually update the local state as the onValue listener will handle it
      } catch (error) {
        console.error("Error removing notification:", error);
      }
    };

    return {
      isOpen,
      notifications,
      unreadCount,
      sortedNotifications,
      toggleDropdown,
      formatTimestamp,
      markAsRead,
      removeNotification,
    };
  },
};
</script>
