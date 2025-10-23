<template>
  <div class="grid grid-cols-1 gap-4">
    <article
      v-for="card in cards"
      :key="card.key"
      class="flex items-start justify-between bg-white rounded-3xl shadow-xs p-5 md:p-6"
      :aria-label="card.aria"
    >

      <div>
        <p class="font-light mb-2">{{ card.label }}</p>
        <p class="text-2xl font-medium font-numbers tracking-tighter" :class="card.class">
          <span v-if="card.prefix">{{ card.prefix }}</span>{{ card.formatted }}€
        </p>
      </div>

      <router-link
        to="/transactions"
        class="bg-gray-100 py-2 px-5 text-xs lg:text-sm font-medium rounded-3xl"
        aria-label="Voir les transactions">
        Voir tout
      </router-link>

    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Stats = {
  totalIncome: number;
  totalExpense: number;
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
}));

const cards = computed(() => [
  {
    key: 'income',
    label: 'Revenus totaux',
    formatted: formatted.value.income,
    prefix: '+',
    class: 'text-emerald-600',
    aria: 'Revenus totaux',
  },
  {
    key: 'expense',
    label: 'Dépenses totales',
    formatted: formatted.value.expense,
    prefix: '-',
    class: 'text-red-700',
    aria: 'Dépenses totales',
  }
]);
</script>
