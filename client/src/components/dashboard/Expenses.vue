<template>
  <div class="bg-white rounded-xl shadow-xs p-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4">Dépenses par catégorie</h3>

    <div v-if="hasData" class="relative h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      Aucune dépense pour le moment
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps<{
  transactions: Array<{
    id: string;
    type: string;
    category: string;
    amount: number;
  }>;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const hasData = computed(() => {
  return props.transactions.some(t => t.type === 'EXPENSE');
});

const getExpensesByCategory = () => {
  const expenses = props.transactions.filter(t => t.type === 'EXPENSE');

  const categoryTotals: Record<string, number> = {};

  expenses.forEach(transaction => {
    const category = transaction.category || 'Autre';
    categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount.toString());
  });

  return categoryTotals;
};

const createChart = () => {
  if (!chartCanvas.value || !hasData.value) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  const categoryData = getExpensesByCategory();
  const labels = Object.keys(categoryData);
  const data = Object.values(categoryData);

  const colors = [
    '#065F46',
    '#10B981',
    '#34D399',
    '#6EE7B7',
    '#1F2937',
    '#374151',
    '#059669',
    '#047857',
    '#4B5563',
    '#14532D',
  ];

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Dépenses (€)',
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' €';
            }
          },
          grid: {
            display: false,
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed.y || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value.toFixed(2)} € (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.transactions, () => {
  createChart();
}, { deep: true });
</script>
