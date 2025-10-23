<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white rounded-xl shadow-xs p-5 md:p-6">
      <p class="text-sm text-gray-500 mb-2">Revenus totaux</p>
      <p class="text-2xl font-bold text-green-600">
        +{{ formatAmount(stats.totalIncome) }} €
      </p>
    </div>
    <div class="bg-white rounded-xl shadow-xs p-5 md:p-6">
      <p class="text-sm text-gray-500 mb-2">Dépenses totales</p>
      <p class="text-2xl font-bold text-red-600">
        -{{ formatAmount(stats.totalExpense) }} €
      </p>
    </div>
    <div class="bg-white rounded-xl shadow-xs p-5 md:p-6">
      <p class="text-sm text-gray-500 mb-2">Balance</p>
      <p class="text-2xl font-bold" :class="stats.balance >= 0 ? 'text-green-600' : 'text-red-600'">
        {{ formatAmount(stats.balance) }} €
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}>();

const formatAmount = (amount: number) => {
  return parseFloat(amount.toString()).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
</script>
