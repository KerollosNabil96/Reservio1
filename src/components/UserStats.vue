<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
        {{ $t("dashboardAdmin.userStatsTitle") }}
      </h3>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t("dashboardAdmin.userStatsTotal") }}
        </p>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ totalUsers }}
        </p>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t("dashboardAdmin.userStatsAdmins") }}
        </p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ adminCount }}
        </p>
      </div>
      <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t("dashboardAdmin.userStatsRegular") }}
        </p>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {{ regularUserCount }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    totalUsers: {
      type: Number,
      required: true,
    },
    adminCount: {
      type: Number,
      required: true,
    },
    regularUserCount: {
      type: Number,
      required: true,
    },
  },
};
</script>
