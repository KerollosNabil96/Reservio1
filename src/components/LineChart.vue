<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
      {{ $t("dashboardAdmin.chartBookingsTitle") }}
    </h3>
    <canvas id="lineChart"></canvas>
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

    const fetchBookingData = async () => {
      const db = getDatabase();
      const bookingsSnapshot = await get(dbRef(db, "bookings"));
      if (bookingsSnapshot.exists()) {
        const bookings = Object.values(bookingsSnapshot.val());
        const bookingsByDate = bookings.reduce((acc, booking) => {
          const date = new Date(booking.date).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        return bookingsByDate;
      }
      return {};
    };

    const renderChart = async () => {
      const bookingsByDate = await fetchBookingData();
      const ctx = document.getElementById("lineChart").getContext("2d");

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      chartInstance.value = new Chart(ctx, {
        type: "line",
        data: {
          labels: Object.keys(bookingsByDate),
          datasets: [
            {
              label: t("dashboardAdmin.chartBookingsTitle"),
              data: Object.values(bookingsByDate),
              borderColor: "#36A2EB",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
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
          scales: {
            x: {
              title: {
                display: true,
                text: t("dashboardAdmin.chartAxisDate"),
              },
            },
            y: {
              title: {
                display: true,
                text: t("dashboardAdmin.chartAxisNumBookings"),
              },
              beginAtZero: true,
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
</style>
