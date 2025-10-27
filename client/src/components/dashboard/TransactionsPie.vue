<template>
  <div class="bg-white rounded-3xl shadow-xs p-5 md:p-6">
    <header class="mb-4">
      <h3 class="text-lg font-semibold">Répartition des transactions</h3>
      <p class="text-sm font-light text-gray-500">{{ labelPeriod }}</p>
    </header>

    <div class="w-full">
      <canvas ref="canvasRef" aria-label="Camembert des transactions par catégorie" role="img"></canvas>
    </div>

    <div v-if="!hasData" class="text-center text-sm text-gray-500 mt-4">
      Aucune transaction à afficher.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

type Transaction = {
  id?: string | number;
  amount: number | string | { toString: () => string } | any;
  category: string;
  type?: string;
  date?: string | Date;
};

const props = defineProps<{
  transactions: Transaction[];
  topN?: number;
  typeFilter?: string | null;
  periodLabel?: string | null;
}>();

const topN = props.topN ?? 8;
const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const toNumber = (value: any) => {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (typeof value.toString === 'function') {
    const parsed = parseFloat(value.toString());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const aggregated = computed(() => {
  const map = new Map<string, number>();
  (props.transactions ?? [])
    .filter(t => (props.typeFilter ? t.type === props.typeFilter : true))
    .forEach(t => {
      const cat = (t.category ?? 'Sans catégorie').toString();
      const amount = toNumber(t.amount);
      map.set(cat, (map.get(cat) || 0) + amount);
    });

  const arr = Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  arr.sort((a, b) => b.total - a.total);
  return arr;
});

const chartData = computed(() => {
  const items = aggregated.value;
  if (items.length === 0) return { labels: [], values: [] };

  const top = items.slice(0, topN);
  const others = items.slice(topN);
  const othersSum = others.reduce((s, it) => s + it.total, 0);

  const labels = top.map(i => i.category);
  const values = top.map(i => i.total);

  if (others.length > 0) {
    labels.push('Autres');
    values.push(othersSum);
  }

  return { labels, values };
});

const generatePalette = (n: number) => {
  const colors = [
    '#065F46', // vert foncé (green-800)
    '#10B981', // vert émeraude (emerald-500)
    '#34D399', // vert clair (emerald-400)
    '#6EE7B7', // vert très clair (emerald-300)
    '#1F2937', // noir grisâtre (gray-800)
    '#374151', // gris foncé (gray-700)
    '#059669', // vert intense (emerald-600)
    '#047857', // vert profond (emerald-700)
    '#4B5563', // gris moyen (gray-600)
    '#14532D', // vert très foncé (green-900)
  ];

  const palette: string[] = [];
  for (let i = 0; i < n; i++) {
    palette.push(colors[i % colors.length]);
  }
  return palette;
};

const hasData = computed(() => chartData.value.labels.length > 0 && chartData.value.values.some(v => v > 0));
const labelPeriod = computed(() => props.periodLabel ?? 'Tous les temps');

const buildChart = () => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const { labels, values } = chartData.value;
  const palette = generatePalette(labels.length || 1);

  chart?.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: palette,
          borderColor: '#fff',
          borderRadius: 10,
          borderWidth: 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom',  labels: { boxWidth: 12, usePointStyle: true, pointStyle: 'circle', padding: 20 } },
        tooltip: {
          callbacks: {
            label(context) {
              const label = context.label ?? '';
              const value = context.raw ?? 0;
              const formatted = Number(value).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              });
              const total = (context.dataset.data as number[]).reduce((s, x) => s + Number(x), 0);
              const pct = total ? ((Number(value) / total) * 100).toFixed(1) : '0.0';
              return `${label} — ${formatted} € (${pct}%)`;
            }
          }
        }
      }
    }
  });
};

onMounted(() => {
  buildChart();
});

watch(chartData, () => {
  buildChart();
}, { deep: true });

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
    chart = null;
  }
});
</script>

<style scoped>
div > canvas {
  width: 100% !important;
  height: 230px !important;
}
</style>
