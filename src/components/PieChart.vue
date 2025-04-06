<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
      {{ $t("dashboardAdmin.chartVenuesTitle") }}
    </h3>
    <canvas id="pieChart" class="pie-chart-small"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import Chart from "chart.js/auto";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t } = useI18n();
    const chartInstance = ref(null);

    const fetchVenueData = async () => {
      const db = getDatabase();
      const venuesSnapshot = await get(dbRef(db, "venues"));
      if (venuesSnapshot.exists()) {
        const venues = Object.values(venuesSnapshot.val());
        const categoryCounts = venues.reduce((acc, venue) => {
          acc[venue.category] = (acc[venue.category] || 0) + 1;
          return acc;
        }, {});
        return categoryCounts;
      }
      return {};
    };

    const renderChart = async () => {
      const categoryCounts = await fetchVenueData();
      const ctx = document.getElementById("pieChart").getContext("2d");

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      chartInstance.value = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              data: Object.values(categoryCounts),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    };

    onMounted(() => {
      renderChart();
    });

    return {};
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}

.pie-chart-small {
  width: 250px !important;
  height: 250px !important;
  margin: 0 auto;
}
</style>
