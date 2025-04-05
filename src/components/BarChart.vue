<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Request Status
        </h3>
        <canvas id="barChart"></canvas>
    </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import Chart from "chart.js/auto";

export default {
    setup() {
        const chartInstance = ref(null);

        const fetchRequestData = async () => {
            const db = getDatabase();

            const statsSnapshot = await get(dbRef(db, "requestStats"));
            const acceptedCount = statsSnapshot.exists() ? statsSnapshot.val().Accepted || 0 : 0;
            const rejectedCount = statsSnapshot.exists() ? statsSnapshot.val().Rejected || 0 : 0;

            const requestsSnapshot = await get(dbRef(db, "requests"));
            const pendingCount = requestsSnapshot.exists() ? Object.keys(requestsSnapshot.val()).length : 0;

            return {
                approved: acceptedCount,
                rejected: rejectedCount,
                pending: pendingCount
            };
        };

        const renderChart = async () => {
            const requestData = await fetchRequestData();
            const ctx = document.getElementById("barChart").getContext("2d");

            if (chartInstance.value) {
                chartInstance.value.destroy();
            }

            chartInstance.value = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Approved", "Rejected", "Pending"],
                    datasets: [
                        {
                            label: "Approved",
                            data: [requestData.approved, 0, 0],
                            backgroundColor: "#4CAF50",
                            borderColor: "#4CAF50",
                            borderWidth: 1,
                            barThickness: 50 // Adjust column width
                        },
                        {
                            label: "Rejected",
                            data: [0, requestData.rejected, 0],
                            backgroundColor: "#FF6384",
                            borderColor: "#FF6384",
                            borderWidth: 1,
                            barThickness: 50 // Adjust column width
                        },
                        {
                            label: "Pending",
                            data: [0, 0, requestData.pending],
                            backgroundColor: "#FFCE56",
                            borderColor: "#FFCE56",
                            borderWidth: 1,
                            barThickness: 50 // Adjust column width
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            onClick: (e, legendItem, legend) => {
                                const index = legendItem.datasetIndex;
                                const meta = legend.chart.getDatasetMeta(index);
                                meta.hidden = !meta.hidden;
                                legend.chart.update();
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.raw}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });
        };

        onMounted(() => {
            renderChart();
        });

        return {};
    }
};
</script>

<style scoped>
canvas {
    max-width: 100%;
    height: auto;
}
</style>