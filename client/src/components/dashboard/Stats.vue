<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
    <article
      v-for="card in cards"
      :key="card.key"
      class="bg-white rounded-2xl shadow-xs p-5 md:p-6"
      :aria-label="card.aria"
    >
      <p class="text-sm text-gray-500 mb-2">{{ card.label }}</p>
      <p
        class="text-2xl font-bold"
        :class="card.class"
      >
        <span v-if="card.prefix">{{ card.prefix }}</span>{{ card.formatted }}€
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Stats = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalBalance: number;
};

const props = defineProps<{ stats: Stats }>();

const formatAmount = (amount: number) =>
  Number(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatted = computed(() => ({
  income: formatAmount(props.stats.totalIncome),
  expense: formatAmount(props.stats.totalExpense),
  balance: formatAmount(props.stats.balance),
  totalBalance: formatAmount(props.stats.totalBalance),
}));

const cards = computed(() => [
  {
    key: 'income',
    label: 'Revenus totaux',
    formatted: formatted.value.income,
    prefix: '+',
    class: 'text-green-600',
    aria: 'Revenus totaux',
  },
  {
    key: 'expense',
    label: 'Dépenses totales',
    formatted: formatted.value.expense,
    prefix: '-',
    class: 'text-red-600',
    aria: 'Dépenses totales',
  },
  {
    key: 'balance',
    label: 'Balance',
    formatted: formatted.value.balance,
    prefix: '',
    class: props.stats.balance >= 0 ? 'text-green-600' : 'text-red-600',
    aria: 'Balance',
  },
  {
    key: 'total-balance',
    label: 'Balance totale',
    formatted: formatted.value.totalBalance,
    prefix: '',
    class: props.stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600',
    aria: 'Balance totale',
  },
]);
</script>
